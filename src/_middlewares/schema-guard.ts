import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'

import { STATUS } from '../utils/constants'

export function validateBody(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.strict().parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        res
          .status(STATUS.BAD_REQUEST)
          .json({ error: 'Invalid data', details: errorMessages })
      } else {
        res
          .status(STATUS.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' })
      }
    }
  }
}

export function validateParams(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        res
          .status(STATUS.BAD_REQUEST)
          .json({ error: 'Invalid data', details: errorMessages })
      } else {
        res
          .status(STATUS.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' })
      }
    }
  }
}
