import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MongooseRepository } from '../_repositories/mongoose-repository'
import { UserDocument, UserModel } from '../models/user/user.model'
import { Roles } from '../models/user/enums/roles.enum'
import { JWT_EXPIRATION, JWT_SECRET_KEY } from '../_config/environment'
import { StatusError } from '../utils/responses/status-error'
import { STATUS } from '../utils/constants'
export class AuthService {
  private readonly userRepository: MongooseRepository<UserDocument>

  constructor() {
    this.userRepository = new MongooseRepository(UserModel)
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(password, 10)
    return this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: Roles.MANAGER
    })
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ email })
    if (!user) {
      throw new StatusError({
        statusCode: STATUS.NOT_FOUND,
        message: 'Usuario no encontrado'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new StatusError({
        statusCode: STATUS.UNAUTHORIZED,
        message: 'Contraseña incorrecta'
      })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET_KEY as string,
      { expiresIn: JWT_EXPIRATION }
    )
    return token
  }
}
