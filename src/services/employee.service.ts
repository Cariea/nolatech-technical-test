import bcrypt from 'bcrypt'
import { MongooseRepository } from '../_repositories/mongoose-repository'
import {
  EmployeeDocument,
  EmployeeModel,
  EvaluationSnapshot
} from '../models/employee/employee.model'
import { Departments } from '../models/employee/enums/departments.enum'
import { Roles } from '../models/user/enums/roles.enum'
import { UserDocument, UserModel } from '../models/user/user.model'
import { Types } from 'mongoose'
import { UpdateEmployeeDto } from '../controllers/employee/dto/update-employee.dto'
import { StatusError } from '../utils/responses/status-error'
import { STATUS } from '../utils/constants'
import {
  EvaluationDocument,
  EvaluationModel
} from '../models/evaluation/evaluation.model'
import {
  QuestionDocument,
  QuestionModel
} from '../models/question/question.model'
export class EmployeeService {
  private readonly employeeRepository: MongooseRepository<EmployeeDocument>
  private readonly userRepository: MongooseRepository<UserDocument>
  private readonly evaluationRepository: MongooseRepository<EvaluationDocument>
  private readonly questionRepository: MongooseRepository<QuestionDocument>

  constructor() {
    this.employeeRepository = new MongooseRepository(EmployeeModel)
    this.userRepository = new MongooseRepository(UserModel)
    this.evaluationRepository = new MongooseRepository(EvaluationModel)
    this.questionRepository = new MongooseRepository(QuestionModel)
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
    const employee = await this.employeeRepository.findById(
      id,
      ['user'],
      ['password']
    )
    if (!employee) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Empleado no encontrado'
      })
    }
    return employee
  }

  async findByManager(managerId: string): Promise<EmployeeDocument[]> {
    return this.employeeRepository.find({
      manager: new Types.ObjectId(managerId)
    })
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

  async addEvaluation(
    employeeId: string,
    evaluationId: string,
    managerId: string
  ): Promise<EmployeeDocument | null> {
    const employee = await this.employeeRepository.findById(employeeId)
    if (!employee) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Empleado no encontrado'
      })
    }

    if (!employee.manager) {
      throw new StatusError({
        statusCode: STATUS.BAD_REQUEST,
        message: 'El empleado no tiene manager asignado'
      })
    }

    if (employee.manager.toString() !== managerId) {
      throw new StatusError({
        statusCode: STATUS.UNAUTHORIZED,
        message: 'No eres el manager de este empleado'
      })
    }

    const evaluation = await this.evaluationRepository.findById(evaluationId)

    if (!evaluation) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Evaluación no encontrada'
      })
    }

    if (evaluation.manager.toString() !== managerId) {
      throw new StatusError({
        statusCode: STATUS.UNAUTHORIZED,
        message: 'No tienes una evaluación con este id'
      })
    }

    const findEvaluationIndex = employee.evaluations.findIndex(
      (evaluation) => evaluation.evaluationId === evaluationId
    )

    if (findEvaluationIndex !== -1) {
      throw new StatusError({
        statusCode: STATUS.BAD_REQUEST,
        message: 'Ya has asignado esta evaluación al empleado'
      })
    }

    const questions = await this.questionRepository.find({
      evaluation: evaluationId
    })

    if (questions.length === 0) {
      throw new StatusError({
        statusCode: STATUS.BAD_REQUEST,
        message: 'La evaluación no tiene preguntas'
      })
    }

    const newEvaluation = {
      evaluationId: evaluationId,
      name: evaluation.name,
      questions: questions.map((question) => ({
        questionId: question._id,
        question: question.question,
        answer: '',
        score: question.score
      }))
    }

    await this.employeeRepository.update(employeeId, {
      $push: { evaluations: newEvaluation }
    })

    const updatedEmployee = await this.employeeRepository.findById(
      employeeId,
      ['user'],
      ['password']
    )

    return updatedEmployee
  }

  async submitEvaluation(
    userId: string,
    evaluationId: string,
    responses: { questionId: string; answer: string }[]
  ): Promise<EmployeeDocument | null> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Usuario no encontrado'
      })
    }

    const employee = await this.employeeRepository.findOne({ user: userId })
    if (!employee) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Empleado no encontrado'
      })
    }

    const evaluationIndex = employee.evaluations.findIndex(
      (evaluation) => evaluation.evaluationId.toString() === evaluationId
    )

    if (evaluationIndex === -1) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Evaluación no encontrada'
      })
    }

    const evaluation = employee.evaluations[evaluationIndex]

    if (evaluation.answared_at) {
      throw new StatusError({
        statusCode: STATUS.BAD_REQUEST,
        message: 'Ya has respondido esta evaluación'
      })
    }

    employee.evaluations[evaluationIndex] = {
      ...evaluation,
      evaluationId: evaluation.evaluationId,
      questions: evaluation.questions.map((question) => {
        const response = responses.find(
          (response) => response.questionId === question.questionId.toString()
        )

        if (!response) {
          return question
        }

        return {
          ...question,
          answer: response.answer
        }
      }),
      answared_at: new Date(),
      assigned_at: evaluation.assigned_at
    }

    await this.employeeRepository.update(employee.id, {
      evaluations: employee.evaluations
    })

    const updatedEmployee = await this.employeeRepository.findById(
      employee.id,
      ['user'],
      ['password']
    )

    return updatedEmployee
  }

  async getReport(employeeId: string): Promise<{
    employee: EmployeeDocument
    answered: {
      evaluationId: string
      questions: any[]
      assigned_at: Date | undefined
      answared_at: Date | undefined
      score: number
    }[]
    pending: EvaluationSnapshot[]
  } | null> {
    const employee = await this.employeeRepository.findById(employeeId)
    if (!employee) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Empleado no encontrado'
      })
    }

    const answered = employee.evaluations
      .filter((evaluation) => evaluation.answared_at)
      .map((evaluation) => {
        const score = evaluation.questions.reduce(
          (acc, question) => acc + question.score,
          0
        )
        // Selecciona sólo las propiedades necesarias
        return {
          evaluationId: evaluation.evaluationId,
          questions: evaluation.questions,
          assigned_at: evaluation.assigned_at,
          answared_at: evaluation.answared_at,
          score
        }
      })

    const pending = employee.evaluations.filter(
      (evaluation) => !evaluation.answared_at
    )

    return { employee, answered, pending }
  }
}
