import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()

  // 日付取得・整形
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const localeDateString = now.toLocaleDateString('ja-JP', options);

  const body = await readBody(event)
  const newItem = await prisma.fridge_items.create({
    data: {
      owner_name: body.owner_name,
      uploaded_at: localeDateString,
      product_name: body.product_name,
      eating_allowed: (body.eating_allowed == 'true' || body.eating_allowed == true),
      image_url: body.image_url,
    },
  })
  console.log(newItem)
  return newItem
})
