import { Response } from 'express'
import { ExtendedRequest } from '../../_middlewares/auth-guard'

import { EvaluationService } from '../../services/evaluation.service'
import { UserService } from '../../services/user.service'
import { Types } from 'mongoose'
import { StatusError } from '../../utils/responses/status-error'
import { STATUS } from '../../utils/constants'

export class EvaluationController {
  private evaluationService: EvaluationService
  private userService: UserService

  constructor() {
    this.evaluationService = new EvaluationService()
    this.userService = new UserService()
  }

  async create(req: ExtendedRequest, res: Response): Promise<void> {
    const { questions, name } = req.body
    const manager = req.user?.id
    try {
      const managerDocument = await this.userService.findById(
        manager as unknown as Types.ObjectId
      )

      if (!managerDocument) {
        throw new StatusError({
          message: 'Manager no encontrado',
          statusCode: STATUS.NOT_FOUND
        })
      }
      const newEvaluation = await this.evaluationService.create(
        questions,
        name,
        managerDocument._id as Types.ObjectId
      )
      res.status(201).json({ evaluation: newEvaluation })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }
}
