import { Types } from 'mongoose'
import { MongooseRepository } from '../_repositories/mongoose-repository'
import {
  EvaluationDocument,
  EvaluationModel
} from '../models/evaluation/evaluation.model'

export class EvaluationService {
  private readonly questionRepository: MongooseRepository<EvaluationDocument>

  constructor() {
    this.questionRepository = new MongooseRepository(EvaluationModel)
  }

  async create(
    questions: Types.ObjectId[],
    manager: Types.ObjectId
  ): Promise<EvaluationDocument> {
    return this.questionRepository.create({ questions, manager })
  }
}
