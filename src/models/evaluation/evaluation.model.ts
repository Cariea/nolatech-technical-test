import { model, Schema, Types, Document } from 'mongoose'

export interface Evaluation {
  questions: Types.ObjectId[]
  name: string
  manager: Types.ObjectId
}

export interface EvaluationDocument extends Evaluation, Document {}

const evaluationSchema = new Schema<EvaluationDocument>({
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    }
  ],
  name: {
    type: String,
    required: true
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export const EvaluationModel = model<EvaluationDocument>(
  'Evaluation',
  evaluationSchema
)
