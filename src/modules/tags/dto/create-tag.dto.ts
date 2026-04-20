import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: 'Insira um nome válido' })
  name: string;

  @IsString({ message: 'Insira uma cor válida' })
  color: string;

  @IsString({ message: 'Insira um ícone válido' })
  icon: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
