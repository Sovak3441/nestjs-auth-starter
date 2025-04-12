import { Injectable, Logger } from '@nestjs/common';

type CachedPermissions = {
  data: string[];
  expiresAt: number;
};

@Injectable()
export class PermissionCacheService {
  private readonly cache = new Map<number, CachedPermissions>();
  private readonly ttl = 1000 * 60 * 5; // 5 minutter
  private readonly logger = new Logger(PermissionCacheService.name);

  get(userId: number): string[] | undefined {
    const cached = this.cache.get(userId);

    if (!cached) return undefined;

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(userId);
      return undefined;
    }

    return cached.data;
  }

  set(userId: number, permissions: string[]) {
    this.cache.set(userId, {
      data: permissions,
      expiresAt: Date.now() + this.ttl,
    });
  }

  clear(userId: number) {
    this.cache.delete(userId);
  }

  clearAll() {
    this.cache.clear();
  }

  /**
   * 🔍 Logger gjeldende cache-tilstand (kun for utvikling)
   */
  logCacheState(verbose = false) {
    const count = this.cache.size;
    this.logger.log(`📦 Cached users: ${count}`);

    if (verbose && count > 0) {
      this.logger.log(`🔍 Detaljer:`);

      for (const [userId, entry] of this.cache.entries()) {
        const remaining = Math.max(entry.expiresAt - Date.now(), 0);
        this.logger.log(
          ` → userId: ${userId} | ${entry.data.length} permissions | expires in: ${Math.floor(
            remaining / 1000,
          )}s`,
        );
      }
    }
  }
}
