import { z } from 'zod'
import { createQuestionDto } from './create-question.dto'

export const updateQuestionDto = createQuestionDto
  .partial()
  .omit({ evaluationId: true })

export const updateQuestionParamsDto = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid ObjectId' })
})

export type UpdateQuestionDto = z.infer<typeof updateQuestionDto>
