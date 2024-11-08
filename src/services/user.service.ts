import bcrypt from 'bcrypt'
import { MongooseRepository } from '../_repositories/mongoose-repository'
import { UserDocument, UserModel } from '../models/user/user.model'
import { Roles } from '../models/user/enums/roles.enum'
import { Types } from 'mongoose'
export class UserService {
  private readonly userRepository: MongooseRepository<UserDocument>

  constructor() {
    this.userRepository = new MongooseRepository(UserModel)
  }

  async create(
    name: string,
    email: string,
    password: string,
    role: Roles
  ): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(password, 10)
    return this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role
    })
  }

  async findById(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userRepository.findOne({ _id: id })
  }
}
