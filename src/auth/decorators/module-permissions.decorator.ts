import { SetMetadata } from '@nestjs/common';
import { PermissionRegistry } from '../permissions/permission.registry';

export const MODULE_PERMISSIONS = 'module:permissions';

export function ModulePermissions(moduleName: string, permissions: string[]) {
  PermissionRegistry.register(moduleName, permissions);
  return SetMetadata(MODULE_PERMISSIONS, permissions);
}
