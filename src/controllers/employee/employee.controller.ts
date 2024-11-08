import { Request, Response } from 'express'
import { EmployeeService } from '../../services/employee.service'
import { ExtendedRequest } from '../../_middlewares/auth-guard'

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
      res.status(201).json({ employee: newEmployee })
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

  async findByManager(req: ExtendedRequest, res: Response): Promise<void> {
    const id = req.user?.id
    try {
      const employees = await this.employeeService.findByManager(id as string)
      res.status(200).json({ employees })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async addEvaluation(req: ExtendedRequest, res: Response): Promise<void> {
    const { employeeId } = req.params
    const { evaluationId } = req.body
    const managerId = req.user?.id
    console.log(managerId)
    try {
      const updatedEmployee = await this.employeeService.addEvaluation(
        employeeId,
        evaluationId,
        managerId as string
      )
      res.status(200).json(updatedEmployee)
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const data = req.body

    try {
      const updatedEmployee = await this.employeeService.update(id, data)
      res.status(200).json(updatedEmployee)
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async addManager(req: Request, res: Response): Promise<void> {
    const { managerId } = req.body
    const { employeeId } = req.params

    try {
      const updatedEmployee = await this.employeeService.addManager(
        employeeId,
        managerId
      )
      res.status(200).json(updatedEmployee)
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async submitEvaluation(req: ExtendedRequest, res: Response): Promise<void> {
    const employeeId = req.user?.id
    const { evaluationId } = req.params
    const responses = req.body.responses

    try {
      const employee = await this.employeeService.submitEvaluation(
        employeeId as string,
        evaluationId,
        responses
      )
      res.status(200).json(employee)
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async getReport(req: ExtendedRequest, res: Response): Promise<void> {
    const { employeeId } = req.params

    try {
      const report = await this.employeeService.getReport(employeeId as string)
      res.status(200).json(report)
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }
}
