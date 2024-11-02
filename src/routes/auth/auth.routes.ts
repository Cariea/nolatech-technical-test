import { Router } from 'express'
import { validateData } from '../../middlewares/schema-guard'
import { createUserDto } from '../../controllers/auth/dto/create-user.dto'
import { AuthController } from '../../controllers/auth/auth.controller'

const router = Router()
const authController = new AuthController()

router.post('/register', validateData(createUserDto), (req, res) =>
  authController.register(req, res)
)

export default router
