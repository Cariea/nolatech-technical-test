import { Router } from 'express'
import { verifyToken } from '../_middlewares/auth-guard'
import AuthRoutes from './auth/auth.routes'
import UserRoutes from './auth/user.routes'

export const router = Router()

// Test endpoint
router.get('/ping', (_req, res) => {
  res.status(418).json({ test: 'todo piola' })
})

router.use('/auth', AuthRoutes)
router.use('/user', UserRoutes)

router.use(verifyToken())
