import { z } from 'zod'
import { createQuestionDto } from './create-question.dto'

export const updateQuestionDto = createQuestionDto
  .partial()
  .omit({ evaluationId: true })

export type UpdateQuestionDto = z.infer<typeof updateQuestionDto>
