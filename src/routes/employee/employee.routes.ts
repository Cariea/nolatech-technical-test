import { Router } from 'express'
import { validateData, validateParams } from '../../_middlewares/schema-guard'
import { createEmployeeDto } from '../../controllers/employee/dto/create-employee.dto'
import { EmployeeController } from '../../controllers/employee/employee.controller'
import { hasAuthorization } from '../../_middlewares/auth-guard'
import { Roles } from '../../models/user/enums/roles.enum'
import { userIdSchema } from '../../controllers/employee/dto/get-by-id.employee.dto'

const router = Router()
const employeeController = new EmployeeController()

router.get('/', hasAuthorization([Roles.ADMIN]), (req, res) =>
  employeeController.findAll(req, res)
)

router.get(
  '/:id',
  hasAuthorization([Roles.ADMIN]),
  validateParams(userIdSchema),
  (req, res) => employeeController.findOne(req, res)
)

router.post(
  '/create',
  hasAuthorization([Roles.ADMIN]),
  validateData(createEmployeeDto),
  (req, res) => employeeController.create(req, res)
)

export default router
