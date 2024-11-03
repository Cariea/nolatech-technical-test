import { Router } from 'express'
import { validateBody } from '../../_middlewares/schema-guard'

import { createEvaluationDto } from '../../controllers/evaluation/dto/create-evaluation.dto'

import { EvaluationController } from '../../controllers/evaluation/evaluation.controller'

import { hasAuthorization } from '../../_middlewares/auth-guard'

import { Roles } from '../../models/user/enums/roles.enum'

const router = Router()
const evaluationController = new EvaluationController()

router.post(
  '/',
  hasAuthorization([Roles.MANAGER]),
  validateBody(createEvaluationDto),
  (req, res) => evaluationController.create(req, res)
)

router.get('/', hasAuthorization([Roles.MANAGER, Roles.ADMIN]), (req, res) =>
  evaluationController.findAll(req, res)
)

router.get(
  '/manager',
  hasAuthorization([Roles.MANAGER, Roles.ADMIN]),
  (req, res) => evaluationController.findAllManagerEvaluations(req, res)
)

export default router
