import { Module, OnModuleInit } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PermissionSeederService } from './auth/services/permission-seeder.service';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PermissionSeederService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly permissionSeeder: PermissionSeederService) {}

  async onModuleInit() {
    await this.permissionSeeder.sync();
  }
}
