import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { RegisterDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(dto: RegisterDto): Promise<{ message: string }> {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (userExist) {
        throw new ConflictException('Email já cadastrado no sistema.');
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
}
