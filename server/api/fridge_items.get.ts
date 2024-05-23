import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async () => {
  const prisma = new PrismaClient()

  const items = await prisma.fridge_items.findMany()

  return items
})
