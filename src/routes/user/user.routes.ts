import { Router } from 'express'
import { validateBody } from '../../_middlewares/schema-guard'
import { createUserDto } from '../../controllers/auth/dto/create-user.dto'
import { UserController } from '../../controllers/user/user.controller'

const router = Router()
const authController = new UserController()

router.post('/create', validateBody(createUserDto), (req, res) =>
  authController.createAdmin(req, res)
)

export default router
