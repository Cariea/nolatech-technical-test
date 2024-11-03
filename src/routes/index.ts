import { Router } from 'express'
import AuthRoutes from './auth/auth.routes'
import { verifyToken } from '../middlewares/auth-guard'

export const router = Router()

// Test endpoint
router.get('/ping', (_req, res) => {
  res.status(418).json({ test: 'todo piola' })
})

router.use('/auth', AuthRoutes)

router.use(verifyToken())
