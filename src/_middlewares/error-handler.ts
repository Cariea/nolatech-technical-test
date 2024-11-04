import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

export const errorHandler = (
  err: ErrorRequestHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
}
