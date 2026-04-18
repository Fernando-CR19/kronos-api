import { EnumNotificationTime, EnumRecurrence } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString({ message: 'Insira um título válido' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate({ message: 'Insira uma data inicial válida' })
  start_at: Date;

  @IsDate({ message: 'Insira uma data final válida' })
  end_at: Date;

  @IsBoolean()
  all_day: boolean;

  @IsEnum(EnumRecurrence)
  recurrence: EnumRecurrence;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tag_ids?: number[];

  @IsEnum(EnumNotificationTime)
  @IsOptional()
  notification_time?: EnumNotificationTime;
}
