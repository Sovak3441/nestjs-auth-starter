import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import {
  OWNERSHIP_CHECK,
  OwnershipOptions,
} from '../decorators/ownership.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<OwnershipOptions>(
      OWNERSHIP_CHECK,
      context.getHandler(),
    );

    if (!options) return true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = request.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const idParam = request.params?.[options.param];

    if (!user || !idParam) return false;

    // ✅ TLA override
    if (user.roles?.some((r: any) => r.name === 'TLA')) {
      return true;
    }

    const modelName = options.model as keyof PrismaService;
    const model = this.prisma[modelName];

    if (!model || typeof (model as any).findUnique !== 'function') {
      throw new Error(
        `Prisma model "${options.model}" does not exist or is invalid`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const resource = await (model as any).findUnique({
      where: { id: Number(idParam) },
    });

    if (!resource) {
      throw new NotFoundException('Ressurs ikke funnet');
    }

    if (resource[options.property] !== user.userId) {
      throw new ForbiddenException('Du eier ikke denne ressursen');
    }

    return true;
  }
}
