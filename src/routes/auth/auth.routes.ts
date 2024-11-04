import { Router } from 'express'
import { validateBody } from '../../_middlewares/schema-guard'
import { createUserDto } from '../../controllers/auth/dto/create-user.dto'
import { AuthController } from '../../controllers/auth/auth.controller'
import { loginDto } from '../../controllers/auth/dto/login.dto'

const router = Router()
const authController = new AuthController()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             parameters:
 *               name:
 *                 type: string
 *                 example: carlos
 *               email:
 *                 type: string
 *                 example: carlos@gmail.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               parameters:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: carlos
 */

router.post('/register', validateBody(createUserDto), (req, res) =>
  authController.register(req, res)
)

router.post('/login', validateBody(loginDto), (req, res) =>
  authController.login(req, res)
)

export default router
