import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString({ message: 'Insira um nome válido' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Insira um nome de usuário válido' })
  @IsOptional()
  username?: string;

  @IsString({ message: 'Insira um telefone válido' })
  @IsOptional()
  phone?: string;
}
