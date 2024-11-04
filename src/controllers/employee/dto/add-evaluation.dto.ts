import { z } from 'zod'

const objectIdRegex = /^[a-fA-F0-9]{24}$/

const ObjectIdSchema = z.string().regex(objectIdRegex)

export const addEvaluationParamsDto = z.object({
  employeeId: ObjectIdSchema
})

export const addEvaluationBodyDto = z.object({
  evaluationId: ObjectIdSchema
})
