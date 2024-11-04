import { model, Schema, Types, Document } from 'mongoose'

export interface Evaluation {
  name: string
  manager: Types.ObjectId
}

export interface EvaluationDocument extends Evaluation, Document {}

const evaluationSchema = new Schema<EvaluationDocument>({
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
