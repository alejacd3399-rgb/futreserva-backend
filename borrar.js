import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.booking.deleteMany({});
  console.log(`Se eliminaron ${deleted.count} reservas.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());