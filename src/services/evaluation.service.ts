import { Types } from 'mongoose'
import { MongooseRepository } from '../_repositories/mongoose-repository'
import {
  EvaluationDocument,
  EvaluationModel
} from '../models/evaluation/evaluation.model'

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
}
