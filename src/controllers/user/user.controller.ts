import { Request, Response } from 'express'
import { UserService } from '../../services/user.service'
import { Roles } from '../../models/user/enums/roles.enum'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async createAdmin(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body

    try {
      const newUser = await this.userService.create(
        name,
        email,
        password,
        Roles.ADMIN
      )
      res.status(201).json({ user: newUser })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }
}
