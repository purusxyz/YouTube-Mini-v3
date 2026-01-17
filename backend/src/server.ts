// src/server.ts
import dotenv from 'dotenv'
import path from 'path'

import app from './app.js'
import { connectDB } from './config/db.js'

// ===============================
// 🔥 LOAD ENV (LOCAL ONLY)
// ===============================
if (!process.env.VERCEL) {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env')
  })
}

// ===============================
// 🗄️ DATABASE (SAFE FOR SERVERLESS)
// ===============================
let isDBConnected = false

async function initDB() {
  if (isDBConnected) return

  try {
    await connectDB()
    isDBConnected = true
    console.log('✅ Database connected')
  } catch (err) {
    console.error('❌ DB connection failed:', err)
    // ⚠️ DO NOT throw outside handler
    throw err
  }
}

// ===============================
// 🌍 ENV DETECTION
// ===============================
const isVercel = !!process.env.VERCEL

// ===============================
// 🚀 LOCAL DEVELOPMENT SERVER
// ===============================
if (!isVercel) {
  const PORT = Number(process.env.PORT) || 5000

  initDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running locally on port ${PORT}`)
      })
    })
    .catch(err => {
      console.error('❌ Server startup failed:', err)
    })
}

// ===============================
// ☁️ VERCEL SERVERLESS ENTRY
// ===============================
export default async function handler(req: any, res: any) {
  try {
    await initDB()
    return app(req, res)
  } catch (err) {
    console.error('❌ FUNCTION_INVOCATION_FAILED:', err)
    res.status(500).json({
      error: 'FUNCTION_INVOCATION_FAILED',
      message: 'Server initialization failed'
    })
  }
}
