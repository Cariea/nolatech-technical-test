import { Schema, model, Document, Types } from 'mongoose'
import { Departments } from './enums/departments.enum'

interface QuestionSnapshot {
  question: Types.ObjectId
  answer?: string
  score: number
}

interface EvaluationSnapshot {
  id: Types.ObjectId
  name: string
  questions: QuestionSnapshot[]
}

export interface EmployeeInterface {
  user: Types.ObjectId
  department: Departments
  manager?: Types.ObjectId
  evaluations: EvaluationSnapshot[]
  salary: number
  experience: number
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
  },
  evaluations: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Evaluation',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      questions: [
        {
          question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true
          },
          answer: {
            type: String,
            required: false
          },
          score: {
            type: Number,
            required: true
          }
        }
      ]
    }
  ],
  salary: {
    type: Number,
    required: true,
    min: 1
  },
  experience: {
    type: Number,
    required: true,
    min: 1
  }
})

export const EmployeeModel = model<EmployeeDocument>('Employee', employeeSchema)
