import { Types } from 'mongoose'
import { MongooseRepository } from '../_repositories/mongoose-repository'
import {
  EvaluationDocument,
  EvaluationModel
} from '../models/evaluation/evaluation.model'
import { UpdateEvaluationDto } from '../controllers/evaluation/dto/update-evaluation.dto'
import { StatusError } from '../utils/responses/status-error'
import { STATUS } from '../utils/constants'

export class EvaluationService {
  private readonly evaluationRepository: MongooseRepository<EvaluationDocument>

  constructor() {
    this.evaluationRepository = new MongooseRepository(EvaluationModel)
  }

  async create(
    questions: Types.ObjectId[],
    name: string,
    manager: Types.ObjectId
  ): Promise<EvaluationDocument> {
    return await this.evaluationRepository.create({ questions, name, manager })
  }

  async findAll(): Promise<EvaluationDocument[]> {
    return this.evaluationRepository.findAll()
  }

  async findAllManagerEvaluations(
    manager: string
  ): Promise<EvaluationDocument[]> {
    return this.evaluationRepository.find({
      manager: new Types.ObjectId(manager)
    })
  }

  async findOne(id: string): Promise<EvaluationDocument | null> {
    return this.evaluationRepository.findById(id)
  }

  //Aun no se puede probar necesito las questions para validar si existen
  async update(
    evaluationId: string,
    managerId: string,
    data: UpdateEvaluationDto
  ): Promise<EvaluationDocument | null> {
    const evaluation = await this.evaluationRepository.findById(evaluationId)

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

    await this.evaluationRepository.update(evaluationId, {
      questions: data.questions as unknown as Types.ObjectId[],
      name: data.name
    })

    const updatedEvaluation = await this.evaluationRepository.findById(
      evaluationId
    )

    return updatedEvaluation
  }
}
