import * as crypto from 'crypto'
import z from 'zod'
import jsonwebtoken from 'jsonwebtoken'

import prisma from '~/lib/prisma'

const { sign } = jsonwebtoken

export const SECRET = 'dummy'

export default eventHandler(async (event) => {
  const result = z
    .object({ username: z.string().min(1), password: z.string().min(1) })
    .safeParse(await readBody(event))
  if (!result.success) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized, username or password is not provided',
    })
  }

  // 入力されたパスワードが正しいか確認
  const salt = await prisma.fridge.findUnique({
    where: {
      user_id: result.data.username,
    },
  }).then((user) => {
    return user.salt_password
  })
  const pepper = useRuntimeConfig().pepper
  const hashedInputedPassword = hashWithSaltPepper(result.data.password, salt, pepper)
  const hashedDBPassword = await prisma.fridge.findUnique({
    where: {
      user_id: result.data.username,
    },
  }).then((user) => {
    return user.hashed_password
  })
  if (hashedInputedPassword !== hashedDBPassword) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized, password is incorrect',
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

function hashWithSaltPepper(input: string, salt: string, pepper: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(input + salt + pepper)
  return hash.digest('hex')
}
