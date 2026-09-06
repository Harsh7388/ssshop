const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users.length);
  const managers = await prisma.serviceManager.findMany();
  console.log('Managers:', managers.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
