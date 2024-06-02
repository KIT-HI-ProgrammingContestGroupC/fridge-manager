export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const token = config.slackBotToken
  const channelId = config.slackChannelId

  try {
    // チャンネルメンバーの取得
    const response = await fetch(`https://slack.com/api/conversations.members?channel=${channelId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch channel members')
    }
    const data = await response.json()
    const memberIds = data.members

    // メンバーの詳細情報の取得
    const members = await Promise.all(memberIds.map(async (id: string) => {
      const userResponse = await fetch(`https://slack.com/api/users.info?user=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info')
      }
      const userData = await userResponse.json()
      return userData.user
    }))

    return members
  }
  catch (error) {
    console.error('Error fetching Slack members:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching Slack members.',
    })
  }
})
