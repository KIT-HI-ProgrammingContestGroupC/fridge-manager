// server/api/getSlackMembers.ts
import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.slackBotToken
  const channelId = config.slackChannelId

  try {
    // チャンネルメンバーの取得
    const response = await axios.get('https://slack.com/api/conversations.members', {
      params: { channel: channelId },
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!response.data.ok) {
      throw new Error(response.data.error)
    }

    const memberIds = response.data.members

    // メンバーの詳細情報の取得
    const members = await Promise.all(memberIds.map(async (id: string) => {
      const userResponse = await axios.get('https://slack.com/api/users.info', {
        params: { user: id },
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!userResponse.data.ok) {
        throw new Error(userResponse.data.error)
      }

      return userResponse.data.user
    }))

    return members
  } catch (error) {
    console.error('Error fetching Slack members:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching Slack members.'
    })
  }
})