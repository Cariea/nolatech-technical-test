import dotenv from 'dotenv'

dotenv.config()

// Environment
export const PORT = process.env.PORT
export const MONGO_URL = process.env.MONGO_URL
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION
