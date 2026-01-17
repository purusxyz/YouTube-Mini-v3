import { google, youtube_v3 } from 'googleapis'
import { Request } from 'express'
import { createOAuthClient } from './googleAuth'

export const getYoutubeClient = (req: Request): youtube_v3.Youtube => {
  // 🔐 HARD AUTH GUARANTEE
 if (!req.cookies?.tokens) {
  throw new Error('AUTH_REQUIRED')
}

const oauth2Client = createOAuthClient()
oauth2Client.setCredentials(JSON.parse(req.cookies.tokens))
 // Return authenticated YouTube client
  return google.youtube({
    version: 'v3',
    auth: oauth2Client
  })
}
