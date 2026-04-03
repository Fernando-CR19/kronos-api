import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LinkGoogleAccountDto {
  @IsEmail({}, { message: 'Email inválido.' })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Google ID é obrigatório.' })
  googleId: string;
}
