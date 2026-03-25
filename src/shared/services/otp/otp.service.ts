import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  private readonly OTP_TTL = 120;
  private readonly MAX_ATTEMPTS = 3;
  private readonly VERIFIED_TTL = 600;

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
      await this.redis.set(`otp:${email}`, JSON.stringify(data));
      return { valid: false, message: 'Invalid code' };
    }

    await this.redis.delete(`otp:${email}`);
    await this.storeVerified(email);
    return { valid: true, message: 'Valid code' };
  }

  async storeVerified(email: string): Promise<void> {
    await this.redis.set(`otp_verified:${email}`, 'true', this.VERIFIED_TTL);
  }

  async isVerified(email: string): Promise<boolean> {
    const raw = await this.redis.get(`otp_verified:${email}`);
    return raw === 'true';
  }

  async deleteVerified(email: string): Promise<void> {
    await this.redis.delete(`otp_verified:${email}`);
  }
}
