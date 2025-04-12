import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Definer permissions
  const permissions = [
    'USER_CREATE',
    'USER_READ',
    'USER_UPDATE',
    'USER_DELETE',
    'DASHBOARD_VIEW',
    'SETTINGS_UPDATE',
  ];

  // 2. Lag permissions i databasen
  for (const key of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
  }

  // 3. Hent opprettede permissions
  const allPermissions = await prisma.permission.findMany();

  const getPermissions = (...keys: string[]) =>
    allPermissions.filter((p) => keys.includes(p.key));

  // 4. Lag roller
  const roles = [
    {
      name: 'TLA',
      isFixed: true,
      permissions: [],
    },
    {
      name: 'Admin',
      isFixed: true,
      permissions: getPermissions(
        'USER_CREATE',
        'USER_READ',
        'USER_UPDATE',
        'DASHBOARD_VIEW',
      ),
    },
    {
      name: 'User',
      isFixed: false,
      permissions: getPermissions('DASHBOARD_VIEW'),
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        isFixed: role.isFixed,
        permissions: {
          connect: role.permissions.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  const tlaRole = await prisma.role.findUnique({ where: { name: 'TLA' } });
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
  const userRole = await prisma.role.findUnique({ where: { name: 'User' } });

  const users = [
    {
      email: 'tla@example.com',
      password: 'secret123',
      roles: [tlaRole],
    },
    {
      email: 'admin@example.com',
      password: 'secret123',
      roles: [adminRole],
    },
    {
      email: 'user@example.com',
      password: 'secret123',
      roles: [userRole],
    },
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashed,
        roles: {
          connect: user.roles.map((role) => ({ id: role!.id })),
        },
      },
    });
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(() => prisma.$disconnect());
