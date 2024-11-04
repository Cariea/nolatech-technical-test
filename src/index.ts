import express from 'express'
import { PORT } from './_config/environment'
import { router } from './routes'
import { connection } from './_config/db'
import { rateLimit } from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import { errorHandler } from './_middlewares/error-handler'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    myapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['src/routes/**/*.ts'] // files containing annotations as above
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

// rate limit settings
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
//Routes
app.use('/', router)
connection()

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`)
})
