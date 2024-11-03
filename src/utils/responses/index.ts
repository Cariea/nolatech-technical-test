import { Response } from 'express'

export interface SchemaError {
  field: string | number
  message: string
}

export const errorResponse = (
  res: Response,
  status: number,
  message: string,
  details?: SchemaError | SchemaError[]
): Response => {
  return res.status(status).json({
    message,
    details
  })
}
