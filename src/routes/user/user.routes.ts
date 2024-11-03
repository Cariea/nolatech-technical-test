import { Router } from 'express'
import { validateData } from '../../_middlewares/schema-guard'
import { createUserDto } from '../../controllers/auth/dto/create-user.dto'
import { UserController } from '../../controllers/user/user.controller'

const router = Router()
const authController = new UserController()

router.post('/create', validateData(createUserDto), (req, res) =>
  authController.create(req, res)
)

export default router
