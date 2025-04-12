import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123',
    },
    {
      email: 'user1@example.com',
      password: 'user1234',
    },
    {
      email: 'user2@example.com',
      password: 'user5678',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
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
  .finally(() => {
    prisma.$disconnect();
  });
