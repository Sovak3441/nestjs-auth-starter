import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PermissionRegistry } from '../permissions/permission.registry';

@Injectable()
export class PermissionSeederService {
  private readonly logger = new Logger(PermissionSeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sync() {
    const allFromCode = PermissionRegistry.getAll();

    const existing = await this.prisma.permission.findMany({
      where: { key: { in: allFromCode } },
      select: { key: true },
    });

    const existingKeys = new Set(existing.map((p) => p.key));

    const missing = allFromCode.filter((p) => !existingKeys.has(p));

    if (missing.length === 0) {
      this.logger.log('✅ Alle permissions er allerede i databasen.');
      return;
    }

    await this.prisma.permission.createMany({
      data: missing.map((key) => ({ key })),
      skipDuplicates: true,
    });

    this.logger.log(`✅ Synkroniserte ${missing.length} nye permissions til databasen.`);
  }
}
