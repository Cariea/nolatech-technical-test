import { Router } from 'express'
import { validateBody, validateParams } from '../../_middlewares/schema-guard'
import { createQuestionDto } from '../../controllers/question/dto/create-question.dto'
import { QuestionController } from '../../controllers/question/question.controller'
import { hasAuthorization } from '../../_middlewares/auth-guard'
import { Roles } from '../../models/user/enums/roles.enum'
import {
  updateQuestionDto,
  updateQuestionParamsDto
} from '../../controllers/question/dto/update-question.dto'

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

router.put(
  '/:id',
  hasAuthorization([Roles.MANAGER]),
  validateParams(updateQuestionParamsDto),
  validateBody(updateQuestionDto),
  (req, res) => questionController.update(req, res)
)

export default router
