import { Router } from 'express'
import { EmployeeController } from '../../controllers/employee/employee.controller'
import { validateParams } from '../../_middlewares/schema-guard'
import { addManagerParamsDto } from '../../controllers/employee/dto/add-manager.dto'

const router = Router()

const employeeController = new EmployeeController()

router.get(
  '/employee/:employeeId',
  validateParams(addManagerParamsDto),
  (req, res) => employeeController.getReport(req, res)
)

export default router
