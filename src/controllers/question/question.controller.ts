import { Response } from 'express'
import { ExtendedRequest } from '../../_middlewares/auth-guard'
import { QuestionService } from '../../services/question.service'
export class QuestionController {
  private questionService: QuestionService

  constructor() {
    this.questionService = new QuestionService()
  }

  async create(req: ExtendedRequest, res: Response): Promise<void> {
    const { question, answer, score, evaluationId } = req.body
    const manager = req.user?.id
    try {
      const newQuestion = await this.questionService.create(
        evaluationId,
        manager as string,
        question,
        answer,
        score
      )
      res.status(201).json({ question: newQuestion })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }

  async findAll(req: ExtendedRequest, res: Response): Promise<void> {
    try {
      const questions = await this.questionService.findAll(
        req.user?.id as string
      )
      res.status(200).json({ questions })
    } catch (error) {
      res
        .status(400)
        .json({ message: error instanceof Error ? error.message : error })
    }
  }
}
