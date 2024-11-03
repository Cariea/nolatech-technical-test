import { z } from 'zod'

const objectIdRegex = /^[a-fA-F0-9]{24}$/

const ObjectIdSchema = z
  .string()
  .regex(objectIdRegex, { message: 'Invalid ObjectId' })

export const createEvaluationDto = z.object({
  questions: z.array(ObjectIdSchema),
  name: z.string().min(3).max(255)
})
