import { Router } from 'express'
import { validateBody } from '../../_middlewares/schema-guard'

import { createQuestionDto } from '../../controllers/question/dto/create-question.dto'

import { QuestionController } from '../../controllers/question/question.controller'

import { hasAuthorization } from '../../_middlewares/auth-guard'

import { Roles } from '../../models/user/enums/roles.enum'

const router = Router()
const questionController = new QuestionController()

router.post(
  '/',
  hasAuthorization([Roles.MANAGER]),
  validateBody(createQuestionDto),
  (req, res) => questionController.create(req, res)
)

router.get('/', hasAuthorization([Roles.MANAGER]), (req, res) =>
  questionController.findAll(req, res)
)

export default router
