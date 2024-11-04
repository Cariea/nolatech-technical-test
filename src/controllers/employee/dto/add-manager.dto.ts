import { z } from 'zod'

const objectIdRegex = /^[a-fA-F0-9]{24}$/

const ObjectIdSchema = z.string().regex(objectIdRegex)

export const addManagerParamsDto = z.object({
  employeeId: ObjectIdSchema
})

export const addManagerBodyDto = z.object({
  managerId: ObjectIdSchema
})
