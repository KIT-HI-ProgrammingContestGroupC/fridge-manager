import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()

  const body = await readBody(event)
  const deletedItem = await prisma.fridge_items.delete({
    where: {
      id: parseInt(body.delete_id),
    },
  })
  console.log(deletedItem)
  return deletedItem
})
