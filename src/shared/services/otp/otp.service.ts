import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  private readonly OTP_TTL = 200;
  private readonly MAX_ATTEMPTS = 3;

  constructor(private readonly redis: RedisService) {}

  generateOTP(): string {
    return String(randomInt(100000, 999999));
  }

  async storeOTP(email: string, code: string) {
    const data = JSON.stringify({ code, attempts: 0 });
    await this.redis.set(`otp:${email}`, data, this.OTP_TTL);
  }

  async validateOTP(
    email: string,
    code: string,
  ): Promise<{ valid: boolean; message: string }> {
    const raw = await this.redis.get(`otp:${email}`);

    if (!raw) {
      return { valid: false, message: 'Code not found or expired' };
    }

    const data = JSON.parse(raw);

    data.attempts++;

    if (data.attempts > this.MAX_ATTEMPTS) {
      await this.redis.delete(`otp:${email}`);
      return { valid: false, message: 'Max attempts exceeded' };
    }

    if (data.code !== code) {
      await this.redis.set(`otp:${email}`, JSON.stringify(data), this.OTP_TTL);
      return { valid: false, message: 'Invalid code' };
    }

    await this.redis.delete(`otp:${email}`);
    return { valid: true, message: 'Valid code' };
  }
}
