// src/server.ts

import dotenv from 'dotenv'
import path from 'path'

// ===============================
// 🔥 LOAD ENV FIRST (BEFORE ANYTHING ELSE)
// ===============================
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

// Optional but useful sanity check (remove later)
if (!process.env.YOUTUBE_API_KEY) {
  console.error('❌ YOUTUBE_API_KEY missing')
}
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('❌ GOOGLE_CLIENT_ID missing')
}

// ===============================
import app from './app'
import { connectDB } from './config/db'

// ===============================
// 🗄️ DATABASE
// ===============================
connectDB()

// ===============================
// 🚀 SERVER
// ===============================
const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})
