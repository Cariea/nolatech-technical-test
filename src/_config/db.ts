import mongoose from 'mongoose'
import { MONGO_URL } from './environment'

export const connection = async () => {
  try {
    await mongoose.connect(MONGO_URL as string)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed', error)
  }
}
