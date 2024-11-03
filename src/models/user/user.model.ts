import { Schema, model, Document } from 'mongoose'
import { Roles } from './enums/roles.enum'

export interface UserInterface {
  name: string
  email: string
  password: string
  role: Roles
}

export interface UserDocument extends UserInterface, Document {}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: Roles
  }
})

export const UserModel = model<UserDocument>('User', userSchema)
