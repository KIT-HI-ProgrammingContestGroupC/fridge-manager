import z from 'zod'
import jsonwebtoken from 'jsonwebtoken'

const { sign } = jsonwebtoken

export const SECRET = 'dummy'

export default eventHandler(async (event) => {
  const result = z
    .object({ username: z.string().min(1), password: z.literal('password') })
    .safeParse(await readBody(event))
  if (!result.success) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized, hint: try `password` as password',
    })
  }

  const expiresIn = (60 * 60 * 24) * 30 // 30 days
  const { username } = result.data
  const user = {
    username,
  }

  const accessToken = sign(user, SECRET, {
    expiresIn,
  })

  return {
    token: accessToken,
  }
})
