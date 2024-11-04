import { Router } from 'express'
import { validateBody, validateParams } from '../../_middlewares/schema-guard'
import { createEmployeeDto } from '../../controllers/employee/dto/create-employee.dto'
import { EmployeeController } from '../../controllers/employee/employee.controller'
import { hasAuthorization } from '../../_middlewares/auth-guard'
import { Roles } from '../../models/user/enums/roles.enum'
import { userIdSchema } from '../../controllers/employee/dto/get-by-id.employee.dto'
import { updateEmployeeDto } from '../../controllers/employee/dto/update-employee.dto'
import {
  addManagerParamsDto,
  addManagerBodyDto
} from '../../controllers/employee/dto/add-manager.dto'
import {
  addEvaluationBodyDto,
  addEvaluationParamsDto
} from '../../controllers/employee/dto/add-evaluation.dto'

const router = Router()
const employeeController = new EmployeeController()

router.get('/', hasAuthorization([Roles.ADMIN]), (req, res) =>
  employeeController.findAll(req, res)
)

router.get('/by-manager', hasAuthorization([Roles.MANAGER]), (req, res) =>
  employeeController.findByManager(req, res)
)

router.get(
  '/:id',
  hasAuthorization([Roles.ADMIN]),
  validateParams(userIdSchema),
  (req, res) => employeeController.findOne(req, res)
)

router.post(
  '/',
  hasAuthorization([Roles.ADMIN]),
  validateBody(createEmployeeDto),
  (req, res) => employeeController.create(req, res)
)

router.put(
  '/:id',
  hasAuthorization([Roles.ADMIN]),
  validateParams(userIdSchema),
  validateBody(updateEmployeeDto),
  (req, res) => employeeController.update(req, res)
)

router.patch(
  '/add-manager/:employeeId',
  hasAuthorization([Roles.ADMIN]),
  validateParams(addManagerParamsDto),
  validateBody(addManagerBodyDto),
  (req, res) => employeeController.addManager(req, res)
)

router.patch(
  '/add-evaluation/:employeeId',
  hasAuthorization([Roles.MANAGER]),
  validateParams(addEvaluationParamsDto),
  validateBody(addEvaluationBodyDto),
  (req, res) => employeeController.addEvaluation(req, res)
)

export default router
