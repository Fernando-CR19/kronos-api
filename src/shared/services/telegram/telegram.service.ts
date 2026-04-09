import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
  ) {}

  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not set, Telegram Bot disabled');
      return;
    }

    this.bot = new Telegraf(token);
    this.initializeHandlers();
    this.bot.launch().catch((err) => {
      this.logger.error('Failed to lauch Telegram bot', err);
    });
  }

  private initializeHandlers() {
    this.bot.command('start', async (command) => {
      await command.reply(
        'Olá, sou o Kronos_Recovery_Bot e vou ajudar você a recuperar a sua senha, por favor envie seu número de telefone cadastrado no aplicativo. \n\nExemplo: 85999887766 ',
      );
    });

    this.bot.on('text', async (txt) => {
      const text = txt.message.text;
      const chatId = txt.chat.id.toString();

      if (/^\d{10,11}$/.test(text)) {
        await this.handlePhoneNumber(txt, chatId, text);
        return;
      }

      await txt.reply(
        'Por favor envie um número de telefone válido com DDD.\n\nExemplo: 85999887766',
      );
    });
  }

  private async handlePhoneNumber(txt: Context, chatId: string, phone: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { phone },
      });

      if (!user) {
        await txt.reply(
          'Número não encontrado no sistema. Cadastre seu telefone nas configurações do app e tente novamente.',
        );
        return;
      }

      const alreadyLinked = user.chat_id === chatId;

      await this.prisma.user.update({
        where: { id: user.id },
        data: { chat_id: chatId },
      });

      const code = this.otpService.generateOTP();
      await this.otpService.storeOTP(user.email, code);
      await this.sendOTP(chatId, code);

      if (alreadyLinked) {
        await txt.reply('Código de recuperação enviado!');
      } else {
        await txt.reply(
          'Conta vinculada com sucesso! Código de recuperação enviado.',
        );
      }
    } catch (error) {
      this.logger.error('Error handling phone number', error);
      await txt.reply('Erro ao processar. Tente novamente.');
    }
  }

  async sendOTP(chatId: string, code: string): Promise<void> {
    await this.bot.telegram.sendMessage(
      chatId,
      `Seu código de recuperação é: *${code}*\n\nEle expira em 2 minutos.`,
      { parse_mode: 'Markdown' },
    );
  }
}
