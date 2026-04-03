import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Banco de dados conectado com sucesso');
    } catch (error) {
      this.logger.error(
        'Não foi possível conectar ao banco de dados',
        error instanceof Error ? error.message : String(error),
      );
      process.exit(1);
    }
  }
}
