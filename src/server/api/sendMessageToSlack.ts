export default async function sendMessageToSlack(message: string) {
  const config = useRuntimeConfig()
  const token = config.slackBotToken
  const channelId = config.slackChannelId

  try {
    const response = await $fetch(`https://slack.com/api/chat.postMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: {
        channel: channelId,
        text: message,
      },
    })
    return response
  }
  catch (error) {
    console.error('Error sending message to Slack:', error)
    throw error
  }
}
