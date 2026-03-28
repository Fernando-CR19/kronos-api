import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ValidateOtpDto } from './dto/validate-otp-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { LinkGoogleAccountDto } from './dto/link-google-account.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-user')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerUserDto: RegisterDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login-user')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('validate-otp')
  @HttpCode(HttpStatus.OK)
  async validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
    return this.authService.validateOtp(validateOtpDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google-callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    const result = await this.authService.googleLogin(req.user);

    if (result.account_exists) {
      return res.redirect(
        `kronos://callback?account_exists=true&email=${req.user.email}&google_id=${req.user.googleId}`,
      )
    }

    return res.redirect(
      `kronos://callback?token=${result.access_token}&first_login=${result.first_login || false}`,
    )
  }

  @Post('google-link')
  @HttpCode(HttpStatus.OK)
  async linkGoogleAccount(@Body() linkGoogleAccount: LinkGoogleAccountDto) {
    return this.authService.linkGoogleAccount(
      linkGoogleAccount.email,
      linkGoogleAccount.googleId,
    );
  }
}
