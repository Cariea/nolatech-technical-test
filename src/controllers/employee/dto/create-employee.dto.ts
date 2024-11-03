import { z } from 'zod'
import { createUserDto } from '../../auth/dto/create-user.dto'

import { Departments } from '../../../models/employee/enums/departments.enum'

export const createEmployeeDto = createUserDto.extend({
  department: z.nativeEnum(Departments)
})
