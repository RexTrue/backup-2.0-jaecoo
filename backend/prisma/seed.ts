import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertUser(email: string, password: string, role: Role) {
  await prisma.user.upsert({
    where: { email },
    update: { password, role, isActive: true },
    create: { email, password, role, isActive: true },
  });
}

async function main() {
  await upsertUser('admin@service.com', 'Admin123!', 'ADMIN');
  await upsertUser('frontline@service.com', 'Frontline123!', 'FRONTLINE');
  await upsertUser('manager@service.com', 'Manager123!', 'MANAGER');
  await upsertUser('mechanic@service.com', 'Mechanic123!', 'MEKANIK');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
