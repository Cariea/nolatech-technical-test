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
      department
    })

    return employee
  }

  async findAll(): Promise<EmployeeDocument[]> {
    return this.employeeRepository.findAll(['user'], ['password'])
  }
}
