import { Schema, model } from 'mongoose'

const eventLogSchema = new Schema({
  action: { type: String, required: true },
  videoId: { type: String },
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
  errorMessage: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export const EventLog = model('EventLog', eventLogSchema)
