import { z } from 'zod'

const objectIdRegex = /^[a-fA-F0-9]{24}$/

const ObjectIdSchema = z
  .string()
  .regex(objectIdRegex, { message: 'Invalid ObjectId' })

export const userIdSchema = z.object({
  id: ObjectIdSchema
})
