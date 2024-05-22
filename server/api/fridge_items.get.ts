import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
const prisma = new PrismaClient();

  const items = await prisma.fridge_items.findMany();

  return items;
});
