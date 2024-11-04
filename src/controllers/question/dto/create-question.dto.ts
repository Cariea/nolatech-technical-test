import { z } from 'zod'

const objectIdRegex = /^[a-fA-F0-9]{24}$/
export const createQuestionDto = z.object({
  question: z.string().min(3).max(255),
  answer: z.string().min(1).max(255),
  score: z.number().int().positive(),
  evaluationId: z.string().regex(objectIdRegex, { message: 'Invalid ObjectId' })
})
