import dotenv from 'dotenv';
dotenv.config(); // load env variables first


import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from '../src/routes/auth.routes.js'
import videoRoutes from '../src/routes/video.routes.js'
import commentRoutes from '../src/routes/comment.routes.js'
import noteRoutes from '../src/routes/note.routes.js'
import { connectDB } from '../src/config/db.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://youtube-mini-frontend.vercel.app' // replace with real frontend URL
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  })
)

app.use(cookieParser())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/note', noteRoutes)

// Connect once (cached)
connectDB()

export default app
