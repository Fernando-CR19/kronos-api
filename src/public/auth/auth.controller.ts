import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-user')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerUserDto: RegisterDto) {
    return this.authService.registerUser(registerUserDto);
  }
}
