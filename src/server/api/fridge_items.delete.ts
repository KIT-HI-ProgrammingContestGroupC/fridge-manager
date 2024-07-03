import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const deletedItem = await prisma.fridge_items.delete({
    where: {
      id: parseInt(body.delete_id),
    },
  })
  console.log(deletedItem)
  return deletedItem
})
