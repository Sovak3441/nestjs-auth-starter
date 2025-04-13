import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PermissionCacheService } from './auth/services/permission-cache.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);

  if (process.env.NODE_ENV === 'development') {
    const permissionCache = app.get(PermissionCacheService);
    permissionCache.logCacheState(true);
  }
}
bootstrap();
