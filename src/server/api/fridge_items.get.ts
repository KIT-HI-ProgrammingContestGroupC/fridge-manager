import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const items = await prisma.fridge.findUnique({
    where: {
      user_id: query.fridge_id,
    },
    include: {
      items: true,
    },
  })

  return items.items
})
