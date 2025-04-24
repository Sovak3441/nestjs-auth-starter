import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleTokenCleanup() {
    const now = new Date();
    const result = await this.prisma.userToken.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });

    this.logger.log(`🧹 Fjernet ${result.count} utløpte refresh tokens`);
  }
}
