import { z } from 'zod'
import { createEmployeeDto } from '../../employee/dto/create-employee.dto'

export const updateEmployeeDto = createEmployeeDto
  .partial()
  .omit({ password: true })

export type UpdateEmployeeDto = z.infer<typeof updateEmployeeDto>
