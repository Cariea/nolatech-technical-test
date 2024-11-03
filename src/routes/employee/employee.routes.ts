import { Router } from 'express'
import { validateData } from '../../_middlewares/schema-guard'
import { createEmployeeDto } from '../../controllers/employee/dto/create-employee.dto'
import { EmployeeController } from '../../controllers/employee/employee.controller'
import { hasAuthorization } from '../../_middlewares/auth-guard'
import { Roles } from '../../models/user/enums/roles.enum'

const router = Router()
const employeeController = new EmployeeController()

router.get('/', hasAuthorization([Roles.ADMIN]), (req, res) =>
  employeeController.findAll(req, res)
)
router.post(
  '/create',
  hasAuthorization([Roles.ADMIN]),
  validateData(createEmployeeDto),
  (req, res) => employeeController.create(req, res)
)

export default router
