import { Schema, model, Document, Types } from 'mongoose'
import { Departments } from './enums/departments.enum'

interface QuestionSnapshot {
  questionID: Types.ObjectId
  question: string
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
  created_at?: Date
  answared_at?: Date
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
          questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true
          },
          question: {
            type: String,
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
      ],
      created_at: {
        type: Date,
        default: Date.now
      },
      answared_at: {
        type: Date,
        required: false,
        default: null
      }
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
