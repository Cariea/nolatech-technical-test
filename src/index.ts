import express from 'express'
import { PORT } from './_config/environment'
import { router } from './routes'
import { connection } from './_config/db'
import { rateLimit } from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import { errorHandler } from './_middlewares/error-handler'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false
})

//App declaration
const app = express()

//Settings
app.set('port', PORT || 3000)

// Middlewares
app.use(limiter)
app.use(mongoSanitize())
app.use(express.json())
app.use(errorHandler)

//Routes
app.use('/', router)
connection()

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`)
})
