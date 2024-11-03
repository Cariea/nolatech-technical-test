import { model, Schema, Types, Document } from 'mongoose'

export interface Question {
  evaluation: Types.ObjectId
  question: string
  answer: string
  score: number
}

export interface QuestionDocument extends Question, Document {}

const questionSchema = new Schema<QuestionDocument>({
  evaluation: {
    type: Schema.Types.ObjectId,
    ref: 'Evaluation',
    required: true
  },
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
  }
})

export const QuestionModel = model<QuestionDocument>('Question', questionSchema)
