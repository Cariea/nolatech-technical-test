import { z } from 'zod'
import { createEvaluationDto } from '../../evaluation/dto/create-evaluation.dto'

export const updateEvaluationDto = createEvaluationDto.partial()

export type UpdateEvaluationDto = z.infer<typeof updateEvaluationDto>
