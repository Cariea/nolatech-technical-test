import { Request, Response } from 'express'
import { EmployeeService } from '../../services/employee.service'

export class EmployeeController {
  private employeeService: EmployeeService

  constructor() {
    this.employeeService = new EmployeeService()
  }

  async create(req: Request, res: Response): Promise<void> {
    const { name, email, password, department } = req.body

    try {
      const newEmployee = await this.employeeService.create(
        name,
        email,
        password,
        department
      )
      res.status(201).json({ user: newEmployee })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }
}
