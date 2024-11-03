import { model, Schema, Types } from 'mongoose'

export interface Question {
  question: string
  answer: string
  score: number
  manager: Types.ObjectId
}

export interface QuestionDocument extends Question, Document {}

const questionSchema = new Schema<QuestionDocument>({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export const QuestionModel = model<QuestionDocument>('Question', questionSchema)
