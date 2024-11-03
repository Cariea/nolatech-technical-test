import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MongooseRepository } from '../repositories/mongoose-repository'
import { UserDocument, UserModel } from '../models/user/user.model'
import { Roles } from '../models/user/enums/roles.enum'
import { JWT_EXPIRATION, JWT_SECRET_KEY } from '../config/environment'
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
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET_KEY as string,
      { expiresIn: JWT_EXPIRATION }
    )
    return token
  }
}
