import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  // 日付取得・整形
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  const localeDateString = now.toLocaleDateString('ja-JP', options)

  const body = await readBody(event)

  // ユーザ名から現在の冷蔵庫IDを取得
  const currentFridgeId = await prisma.fridge.findFirst({
    where: {
      user_id: body.fridge_id,
    },
  }).then((fridge) => {
    return fridge.id
  })

  const newItem = await prisma.item.create({
    data: {
      owner_name: body.owner_name,
      uploaded_at: localeDateString,
      product_name: body.product_name,
      eating_allowed: (body.eating_allowed == 'true' || body.eating_allowed == true),
      image_url: body.image_url,
      fridgeId: currentFridgeId,
    },
  })
  console.log(newItem)
  return newItem
})
