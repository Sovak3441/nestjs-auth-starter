import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionCacheService } from './services/permission-cache.service';
import { TokenCleanupService } from './services/token-cleanup.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PermissionCacheService,
    TokenCleanupService,
  ],
})
export class AuthModule {}
