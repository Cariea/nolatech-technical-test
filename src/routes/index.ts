import { Router } from 'express'
import AuthRoutes from './auth/auth.routes'
export const router = Router()

// Test endpoint
router.get('/ping', (_req, res) => {
  res.status(418).json({ test: 'todo piola' })
})

router.use('/auth', AuthRoutes)
