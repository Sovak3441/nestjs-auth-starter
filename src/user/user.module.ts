import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ModulePermissions } from '../auth/decorators/module-permissions.decorator';

@ModulePermissions('user', ['create', 'update', 'delete', 'view'])
@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
