import { z } from 'zod'

export const submitEvaluationParamsDto = z.object({
  evaluationId: z.string().regex(/^[a-fA-F0-9]{24}$/)
})

export const submitEvaluationBodyDto = z.object({
  responses: z
    .array(
      z.object({
        questionId: z.string().regex(/^[a-fA-F0-9]{24}$/),
        answer: z.string().min(1).max(255)
      })
    )
    .min(1)
})
