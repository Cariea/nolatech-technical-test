import { Response } from 'express'
import { ExtendedRequest } from '../../_middlewares/auth-guard'

import { EvaluationService } from '../../services/evaluation.service'
import { UserService } from '../../services/user.service'
import { Types } from 'mongoose'
import { StatusError } from '../../utils/responses/status-error'
import { STATUS } from '../../utils/constants'
//import { Roles } from '../../models/user/enums/roles.enum'

export class EvaluationController {
  private evaluationService: EvaluationService
  private userService: UserService

  constructor() {
    this.evaluationService = new EvaluationService()
    this.userService = new UserService()
  }

  async create(req: ExtendedRequest, res: Response): Promise<void> {
    const { name } = req.body
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

  async findAll(_req: ExtendedRequest, res: Response): Promise<void> {
    try {
      const evaluations = await this.evaluationService.findAll()
      res.status(200).json({ evaluations })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async findAllManagerEvaluations(
    req: ExtendedRequest,
    res: Response
  ): Promise<void> {
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

      const evaluations =
        await this.evaluationService.findAllManagerEvaluations(
          manager as string
        )
      res.status(200).json({ evaluations })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async findOne(req: ExtendedRequest, res: Response): Promise<void> {
    const { id } = req.params

    try {
      const evaluation = await this.evaluationService.findOne(id)

      // if (req.user?.role === Roles.MANAGER) {
      //   if (evaluation?.manager.toString() !== req.user?.id) {
      //     throw new StatusError({
      //       message: 'No tienes permiso para ver esta evaluación',
      //       statusCode: STATUS.FORBIDDEN
      //     })
      //   }
      // }
      res.status(200).json({ evaluation })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }
}
