import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ValidateOtpDto {
  @IsEmail({}, { message: 'Email inválido.' })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Código é obrigatório.' })
  @Length(6, 6, { message: 'O código deve ter 6 dígitos.' })
  code: string;
}