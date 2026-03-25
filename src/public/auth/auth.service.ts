import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/shared/services/otp/otp.service';
import { EmailService } from 'src/shared/services/email/email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ValidateOtpDto } from './dto/validate-otp-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
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

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const code = this.otpService.generateOTP();
    await this.otpService.storeOTP(dto.email, code);
    await this.emailService.sendOTP(dto.email, code);

    return { message: 'OTP sent successfully' };
  }

  async validateOtp(dto: ValidateOtpDto): Promise<{ message: string }> {
    const result = await this.otpService.validateOTP(dto.email, dto.code);

    if (!result.valid) {
      throw new BadRequestException(result.message);
    }

    return { message: 'OTP validated successfully' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const isVerified = await this.otpService.isVerified(dto.email);

    if (!isVerified) {
      throw new BadRequestException('OTP not verified or expired');
    }

    await this.otpService.deleteVerified(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }
}
