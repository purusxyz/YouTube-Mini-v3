// src/services/youtube.public.ts
import { google } from 'googleapis'

export function getPublicYoutube() {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    throw new Error('❌ YOUTUBE_API_KEY is missing at runtime')
  }

  return google.youtube({
    version: 'v3',
    auth: apiKey
  })
}
