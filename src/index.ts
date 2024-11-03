import express from 'express'
import { PORT } from './_config/environment'
import { router } from './routes'
import { connection } from './_config/db'

//App declaration
const app = express()

//Settings
app.set('port', PORT || 3000)

// Middlewares
app.use(express.json())

//Routes
app.use('/', router)

connection()

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`)
})
