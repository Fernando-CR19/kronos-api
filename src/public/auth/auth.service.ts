import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterDto): Promise<{ message: string }> {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (userExist) {
        throw new ConflictException('Email already registered in the system.');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      await this.prisma.user.create({
        data: { ...dto, password: hashedPassword },
      });

      return { message: 'User created successfully' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user.');
    }
  }

  async loginUser(
    loginDto: LoginDto,
  ): Promise<{ message: string; access_token: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginDto.email,
        },
        select: {
          uuid: true,
          password: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('The password is wrong');
      }

      const payload = {
        sub: user.uuid,
      };

      const access_token = await this.jwtService.signAsync(payload);

      return {
        message: 'Login successfully',
        access_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while trying to log in.');
    }
  }
}
