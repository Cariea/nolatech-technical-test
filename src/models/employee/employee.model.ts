import { Schema, model, Document, Types } from 'mongoose'
import { Departments } from './enums/departments.enum'

export interface EmployeeInterface {
  user: Types.ObjectId
  department: Departments
  manager?: Types.ObjectId
}
export interface EmployeeDocument extends EmployeeInterface, Document {}

const employeeSchema = new Schema<EmployeeDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: Departments
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
})

export const EmployeeModel = model<EmployeeDocument>('Employee', employeeSchema)
