import { PERIOD_EXCEEDED_MS, PERIOD_EXCEEDED_STRING } from '~/constants'

export default defineTask({
  meta: {
    name: 'sendslackmessage',
    description: 'send slack messages',
  },
  async run() {
    try {
      // 1.データベースから商品情報を取得
      const items = await $fetch('/api/fridge_items')

      // 2.二週間が経過した商品を見つける
      const today = new Date()
      const twoWeeksAgo = new Date(today.getTime() - PERIOD_EXCEEDED_MS) // 現在の日付 - 14日間をミリ秒単位
      const expiredProducts = items.filter((item) => {
        return new Date(item.uploaded_at) <= twoWeeksAgo
      })

      // 3.Slackにメッセージを送信
      for (const product of expiredProducts) {
        const message = `${product.product_name}は、${PERIOD_EXCEEDED_STRING}以上入ったままだよ`
        await $fetch('/api/sendMessageToSlack', { // `await` は非同期関数内でのみ使用可能
          method: 'POST',
          body: {
            message: message,
          },
        })
      }

      const imessage = `(プロコンの間既定の時間に送るかの確認中)`
      await $fetch('/api/sendMessageToSlack', { // `await` は非同期関数内でのみ使用可能
        method: 'POST',
        body: {
          message: imessage,
        },
      })

      return { result: 'Task completed successfully' }
    }
    catch (error) {
      console.error('Error checking product expiration:', error)
      return { error: 'Error checking product expiration' }
    }
  },
})
