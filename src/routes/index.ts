import { Router } from 'express'
import { verifyToken } from '../_middlewares/auth-guard'
import AuthRoutes from './auth/auth.routes'
import UserRoutes from './user/user.routes'
import EmployeeRoutes from './employee/employee.routes'
import EvaluationsRoutes from './evaluations/evaluation.routes'
import QuestionsRoutes from './questions/question.routes'
import ReportsRouter from './reports/reports.routes'
export const router = Router()

// Test endpoint
router.get('/ping', (_req, res) => {
  res.status(418).json({ test: 'todo piola' })
})

router.use('/auth', AuthRoutes)
router.use('/user', UserRoutes)

router.use(verifyToken())

router.use('/employees', EmployeeRoutes)
router.use('/evaluations', EvaluationsRoutes)
router.use('/questions', QuestionsRoutes)
router.use('/reports', ReportsRouter)
