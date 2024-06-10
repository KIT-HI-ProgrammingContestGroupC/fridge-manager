import sendMessageToSlack from '~/server/api/sendMessageToSlack'

export default defineTask({
  meta: {
    name: 'sendslackmessage',
    description: 'send slack messages',
  },
  async run() {
    try {
      console.log('maihun')
      // 1.データベースから商品情報を取得
      const items = await $fetch('/api/fridge_items')

      // 2.二週間が経過した商品を見つける
      const today = new Date()
      const twoWeeksAgo = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000)) // 現在の日付 - 14日間をミリ秒単位
      const expiredProducts = items.filter((item) => { //
        return new Date(item.uploaded_at) <= twoWeeksAgo
      })

      // 3.Slackにメッセージを送信
      expiredProducts.forEach((product) => {
        const message = `${product.product_name}は、2週間以上入ったままだよ`
        sendMessageToSlack(message)
      })

      const message = `(プロコンの間既定の時間に送るかの確認中)`
      sendMessageToSlack(message)

      return { result: 'Task completed successfully' }
    }
    catch (error) {
      console.error('Error checking product expiration:', error)
      return { error: 'Error checking product expiration' }
    }
  },
})
