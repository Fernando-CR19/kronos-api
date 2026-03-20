import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido.' })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
