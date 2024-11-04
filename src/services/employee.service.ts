import bcrypt from 'bcrypt'
import { MongooseRepository } from '../_repositories/mongoose-repository'
import {
  EmployeeDocument,
  EmployeeModel
} from '../models/employee/employee.model'
import { Departments } from '../models/employee/enums/departments.enum'
import { Roles } from '../models/user/enums/roles.enum'
import { UserDocument, UserModel } from '../models/user/user.model'
import { Types } from 'mongoose'
import { UpdateEmployeeDto } from '../controllers/employee/dto/update-employee.dto'
import { StatusError } from '../utils/responses/status-error'
import { STATUS } from '../utils/constants'
export class EmployeeService {
  private readonly employeeRepository: MongooseRepository<EmployeeDocument>
  private readonly userRepository: MongooseRepository<UserDocument>

  constructor() {
    this.employeeRepository = new MongooseRepository(EmployeeModel)
    this.userRepository = new MongooseRepository(UserModel)
  }

  async create(
    name: string,
    email: string,
    password: string,
    salary: number,
    experience: number,
    department: Departments
  ): Promise<EmployeeDocument> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: Roles.EMPLOYEE
    })

    const employee = await this.employeeRepository.create({
      user: user._id as Types.ObjectId,
      salary,
      experience,
      department
    })

    return employee
  }

  async findAll(): Promise<EmployeeDocument[]> {
    return this.employeeRepository.findAll(['user'], ['password'])
  }

  async findOne(id: string): Promise<EmployeeDocument | null> {
    return this.employeeRepository.findById(id, ['user'], ['password'])
  }

  async update(
    id: string,
    data: UpdateEmployeeDto
  ): Promise<EmployeeDocument | null> {
    const employee = await this.employeeRepository.findById(id)
    if (!employee) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Empleado no encontrado'
      })
    }

    const user = await this.userRepository.findById(
      employee.user._id as unknown as string
    )

    if (!user) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Usuario no encontrado'
      })
    }

    if (data.email && data.email !== user.email) {
      const userWithSameEmail = await this.userRepository.findOne({
        email: data.email
      })

      if (userWithSameEmail) {
        throw new StatusError({
          statusCode: STATUS.CONFLICT,
          message: 'Ya existe un usuario con ese email'
        })
      }
    }

    await this.userRepository.update(
      employee.user._id as unknown as string,
      data
    )

    await this.employeeRepository.update(id, data)

    const updatedEmployee = await this.employeeRepository.findById(
      id,
      ['user'],
      ['password']
    )

    return updatedEmployee
  }

  async addManager(
    employeeId: string,
    managerId: string
  ): Promise<EmployeeDocument | null> {
    const employee = await this.employeeRepository.findById(employeeId)
    if (!employee) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Empleado no encontrado'
      })
    }

    const manager = await this.userRepository.findById(managerId)
    if (!manager) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Manager no encontrado'
      })
    }

    await this.employeeRepository.update(employeeId, {
      manager: new Types.ObjectId(managerId)
    })

    const updatedEmployee = await this.employeeRepository.findById(
      employeeId,
      ['user'],
      ['password']
    )

    return updatedEmployee
  }
}
