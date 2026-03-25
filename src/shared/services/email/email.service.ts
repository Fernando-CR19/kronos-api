import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendOTP(email: string, code: string) {
    await this.resend.emails.send({
      from: 'Kronos <onboarding@resend.dev>',
      to: email,
      subject: 'Código de recuperação de senha',
      html: `
        <h2>Recuperação de senha</h2>
        <p>Seu código de verificação é:</p>
        <h1>${code}</h1>
        <p>Este código expira em 2 minutos.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      `,
    });
  }
}
