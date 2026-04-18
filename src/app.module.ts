import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/services/prisma/prisma.module';
import { AuthModule } from './public/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './shared/services/redis/redis.module';
import { OtpModule } from './shared/services/otp/otp.module';
import { EmailModule } from './shared/services/email/email.module';
import { TelegramModule } from './shared/services/telegram/telegram.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    RedisModule,
    OtpModule,
    EmailModule,
    TelegramModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
