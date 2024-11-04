import { z } from 'zod'

export const createEvaluationDto = z.object({
  name: z.string().min(3).max(255)
})
