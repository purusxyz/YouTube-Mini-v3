// src/app.ts
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes'
import videoRoutes from './routes/video.routes'
import commentRoutes from './routes/comment.routes'
import noteRoutes from './routes/note.routes'

const app = express()

// ===============================
// 🌐 CORS CONFIG
// ===============================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
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

// ===============================
// 🧠 BODY PARSER
// ===============================
app.use(express.json())

// ===============================
// 🔐 SESSION (MUST BE BEFORE ROUTES)
// ===============================
// app.use(
//   session({
//     name: 'youtube-mini.sid',
//     secret: process.env.SESSION_SECRET || 'youtube-mini-secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false, // ✅ true only in HTTPS
//       sameSite: 'lax'
//     }
//   })
// )


app.use(cookieParser())
// ===============================
// 🚀 ROUTES
// ===============================
app.use('/auth', authRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/note', noteRoutes)

// ===============================
// 🛑 GLOBAL ERROR HANDLER
// ===============================
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('GLOBAL ERROR:', err)
  res.status(err.status || 500).json({
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong'
  })
})

export default app
