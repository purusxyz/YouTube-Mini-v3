// src/server.ts
import dotenv from 'dotenv'
import path from 'path'
import type { VercelRequest, VercelResponse } from '@vercel/node'

import app from './app.js'
import { connectDB } from './config/db.js'

// ===============================
// 🔥 LOAD ENV
// ===============================
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

// ===============================
// 🗄️ DATABASE (cached for serverless)
// ===============================
let isDBConnected = false

async function initDB() {
  if (!isDBConnected) {
    await connectDB()
    isDBConnected = true
  }
}

// ===============================
// 🌍 ENV DETECTION
// ===============================
const isVercel = !!process.env.VERCEL

// ===============================
// 🚀 LOCAL SERVER
// ===============================
if (!isVercel) {
  const PORT = Number(process.env.PORT) || 5000

  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running locally on port ${PORT}`)
    })
  })
}

// ===============================
// ☁️ VERCEL SERVERLESS HANDLER
// ===============================
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await initDB()
  return app(req as any, res as any)
}
