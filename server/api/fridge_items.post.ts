import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
const prisma = new PrismaClient();

  const body = await readBody(event);
  const newItem = await prisma.fridge_items.create({
  data: {
      owner_name: body.owner_name,
      product_name: body.product_name,
      eating_allowed: body.eating_allowed == "true",
      image_url: body.image_url,
  },
  });
  console.log(newItem);
  return newItem;
});
