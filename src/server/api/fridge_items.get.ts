import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  // DEBUG:
  console.log('query = ', query)
  console.log('fridge_id = ', query.fridge_id)

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
