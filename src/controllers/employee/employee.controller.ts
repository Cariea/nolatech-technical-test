import { Request, Response } from 'express'
import { EmployeeService } from '../../services/employee.service'

export class EmployeeController {
  private employeeService: EmployeeService

  constructor() {
    this.employeeService = new EmployeeService()
  }

  async create(req: Request, res: Response): Promise<void> {
    const { name, email, password, department, salary, experience } = req.body

    try {
      const newEmployee = await this.employeeService.create(
        name,
        email,
        password,
        salary,
        experience,
        department
      )
      res.status(201).json({ user: newEmployee })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const employees = await this.employeeService.findAll()
      res.status(200).json({ employees })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async findOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    try {
      const employee = await this.employeeService.findOne(id)
      res.status(200).json({ employee })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }
}
