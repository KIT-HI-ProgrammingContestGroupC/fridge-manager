// return an array of user objects: information of members who belong to the specified Slack channel
// about user object, see https://api.slack.com/methods/users.info#examples

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const token = config.slackBotToken
  const channelId = config.slackChannelId

  try {
    // チャンネルメンバーの取得
    const response = await $fetch('https://slack.com/api/conversations.members', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        channel: channelId,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch channel members')
    }

    // メンバーの詳細情報の取得
    const memberIds = response.members

    const infoOfMembers = await Promise.all(memberIds.map(async (id: string) => {
      const userResponse = await $fetch('https://slack.com/api/users.info', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        query: {
          user: id,
        },
      })
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info')
      }
      return userResponse.user
    }))

    return infoOfMembers
  }
  catch (error) {
    console.error('Error fetching Slack members:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching Slack members.',
    })
  }
})
