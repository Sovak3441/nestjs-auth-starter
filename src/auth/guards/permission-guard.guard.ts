import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PermissionCacheService } from '../services/permission-cache.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private permissionCache: PermissionCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    // TLA override
    if (user.roles?.some((r: any) => r.name === 'TLA')) return true;

    // Hent fra cache hvis mulig
    let userPermissions = this.permissionCache.get(user.userId);

    if (!userPermissions) {
      // Hent fra DB og legg i cache
      const found = await this.prisma.user.findUnique({
        where: { id: user.userId },
        include: {
          roles: { include: { permissions: true } },
        },
      });

      if (!found) return false;

      userPermissions = found.roles.flatMap(role =>
        role.permissions.map(p => p.key),
      );

      this.permissionCache.set(user.userId, userPermissions);
    }

    // Sjekk om brukeren har alle nødvendige permissions
    return requiredPermissions.every(p => userPermissions?.includes(p));
  }
}
