import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './routes/user.routes'
import { authRouter } from './routes/auth.routes'
import { errorHandler } from './middleware/error'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)

// Error handling
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) 