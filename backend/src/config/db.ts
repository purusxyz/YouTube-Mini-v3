import mongoose from 'mongoose'

let cached = false

export const connectDB = async () => {
  if (cached) return

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    cached = true
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    throw err
  }
}
