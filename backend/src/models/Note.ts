import { Schema, model } from 'mongoose'

export const Note = model(
  'Note',
  new Schema({
    videoId: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  })
)
