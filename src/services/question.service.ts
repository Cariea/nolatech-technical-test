import { Types } from 'mongoose'
import { MongooseRepository } from '../_repositories/mongoose-repository'
import {
  QuestionDocument,
  QuestionModel
} from '../models/question/question.model'
import {
  EvaluationDocument,
  EvaluationModel
} from '../models/evaluation/evaluation.model'
import { StatusError } from '../utils/responses/status-error'
import { STATUS } from '../utils/constants'
import { UserService } from './user.service'
import { UpdateQuestionDto } from '../controllers/question/dto/update-question.dto'

export class QuestionService {
  private readonly questionRepository: MongooseRepository<QuestionDocument>
  private readonly evaluationRepository: MongooseRepository<EvaluationDocument>
  private userServices: UserService

  constructor() {
    this.questionRepository = new MongooseRepository(QuestionModel)
    this.evaluationRepository = new MongooseRepository(EvaluationModel)
    this.userServices = new UserService()
  }

  async create(
    evaluationId: string,
    managerId: string,
    question: string,
    answer: string,
    score: number
  ): Promise<QuestionDocument> {
    const evaluation = new Types.ObjectId(evaluationId)

    const evaluationExists = await this.evaluationRepository.findById(
      evaluationId
    )

    if (!evaluationExists) {
      throw new StatusError({
        message: 'Evaluation not found',
        statusCode: STATUS.NOT_FOUND
      })
    }

    console.log(evaluationExists.manager.toString(), managerId)
    if (evaluationExists.manager.toString() !== managerId) {
      throw new StatusError({
        message: 'Evaluation not found',
        statusCode: STATUS.NOT_FOUND
      })
    }

    const newQuestion = await this.questionRepository.create({
      evaluation,
      question,
      answer,
      score
    })

    return newQuestion
  }

  async findAll(managerId: string): Promise<QuestionDocument[]> {
    const managerIdObj = new Types.ObjectId(managerId)

    const managerDocument = await this.userServices.findById(managerIdObj)
    if (!managerDocument) {
      throw new StatusError({
        message: 'Manager not found',
        statusCode: STATUS.NOT_FOUND
      })
    }

    const evaluations = await this.evaluationRepository.find({
      manager: managerIdObj
    })
    const evaluationIds = evaluations.map((evaluation) => evaluation._id)

    const questions = await this.questionRepository.find({
      evaluation: { $in: evaluationIds }
    })

    return questions
  }

  async update(
    questionId: string,
    managerId: string,
    data: UpdateQuestionDto
  ): Promise<QuestionDocument | null> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      throw new StatusError({
        message: 'Question not found',
        statusCode: STATUS.NOT_FOUND
      })
    }

    const evaluation = await this.evaluationRepository.findById(
      question.evaluation._id.toString()
    )

    if (!evaluation) {
      throw new StatusError({
        message: 'Evaluation not found',
        statusCode: STATUS.NOT_FOUND
      })
    }

    if (evaluation.manager.toString() !== managerId) {
      throw new StatusError({
        message: 'Evaluation not found',
        statusCode: STATUS.NOT_FOUND
      })
    }

    await this.questionRepository.update(questionId, { ...data })

    const updatedQuestion = await this.questionRepository.findById(questionId)

    return updatedQuestion
  }
}
