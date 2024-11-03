import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { STATUS } from '../utils/constants'
import { JWT_SECRET_KEY } from '../config/environment'
import { errorResponse } from '../utils/responses'
import { Roles } from '../models/user/enums/roles.enum'

interface ExtendedRequestUser {
  id: string
  role: Roles
  iat: number
  exp: number
}

export interface ExtendedRequest extends Request {
  user?: ExtendedRequestUser
}

export const verifyToken =
  () =>
  (req: ExtendedRequest, res: Response, next: NextFunction): any => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'Token requerido')
    }

    try {
      jwt.verify(String(token), String(JWT_SECRET_KEY))
      const decoded = jwt.decode(String(token))
      req.user = decoded as ExtendedRequestUser
      return next()
    } catch (error) {
      console.log(error)
      errorResponse(res, STATUS.UNAUTHORIZED, 'Error al decodificar el token')
    }
  }

export const hasAuthorization =
  (validRoles: Roles) =>
  (req: ExtendedRequest, res: Response, next: NextFunction): any => {
    try {
      const role = req.user?.role || ''

      if (!validRoles.includes(role)) {
        return errorResponse(
          res,
          STATUS.UNAUTHORIZED,
          'No autorizado para realizar esta acción'
        )
      }
      return next()
    } catch (error) {
      errorResponse(
        res,
        STATUS.UNAUTHORIZED,
        'No autorizado para realizar esta acción'
      )
    }
  }
