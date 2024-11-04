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

export class QuestionService {
  private readonly questionRepository: MongooseRepository<QuestionDocument>
  private readonly evaluationRepository: MongooseRepository<EvaluationDocument>
  constructor() {
    this.questionRepository = new MongooseRepository(QuestionModel)
    this.evaluationRepository = new MongooseRepository(EvaluationModel)
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
}
