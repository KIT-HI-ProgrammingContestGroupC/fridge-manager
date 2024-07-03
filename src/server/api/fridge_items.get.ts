import prisma from '~/lib/prisma'

export default defineEventHandler(async () => {
  const items = await prisma.fridge_items.findMany()

  return items
})
