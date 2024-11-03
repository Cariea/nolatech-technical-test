import { Request, Response } from 'express'
import { AuthService } from '../../services/auth.service'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body

    try {
      const newUser = await this.authService.register(name, email, password)
      res.status(201).json({ user: newUser })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body

    try {
      const token = await this.authService.login(email, password)
      res.status(200).json({ token })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }
}
