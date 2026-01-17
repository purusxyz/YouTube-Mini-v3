import { Router, Request, Response } from 'express'
import { youtube_v3 } from 'googleapis'
import { getPublicYoutube } from '../services/youtube.public.js'
import { getYoutubeClient } from '../services/youtube.js'
import { eventLoggerMiddleware } from '../middleware/eventLogger.middleware.js'

const router = Router()

// ===============================
// 🔧 Normalize YouTube Video ID
// ===============================
function extractVideoId(input: string): string {
  if (!input) return ''

  if (input.includes('youtu.be/')) {
    return input.split('youtu.be/')[1].split('?')[0]
  }

  if (input.includes('watch?v=')) {
    return input.split('watch?v=')[1].split('&')[0]
  }

  return input.trim()
}

// =====================================================
// 🌍 PUBLIC — FETCH VIDEO DETAILS (API KEY)
// =====================================================
router.get(
  '/:id',
  eventLoggerMiddleware('VIDEO_FETCHED', req => req.params.id),
  async (req: Request, res: Response) => {
    try {
      const videoId = extractVideoId(req.params.id)
      if (!videoId) {
        return res.status(400).json({ error: 'INVALID_VIDEO_ID' })
      }

      // ✅ CREATE CLIENT AT RUNTIME (FIXES 403 + ENV ISSUE)
      const youtube = getPublicYoutube()

      const response = await youtube.videos.list({
        part: ['snippet', 'statistics'],
        id: [videoId]
      })

      const video = response.data.items?.[0]
      if (!video || !video.snippet) {
        return res.status(404).json({ error: 'VIDEO_NOT_FOUND' })
      }

      res.json({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails?.high?.url ?? null,
        views: video.statistics?.viewCount ?? '0',
        likes: video.statistics?.likeCount ?? '0'
      })
    } catch (err) {
      console.error('FETCH VIDEO ERROR:', err)
      res.status(500).json({ error: 'FAILED_TO_FETCH_VIDEO' })
    }
  }
)

// =====================================================
// 🔐 AUTH REQUIRED — UPDATE TITLE & DESCRIPTION (OAUTH)
// =====================================================
router.put(
  '/:id',
  eventLoggerMiddleware('VIDEO_UPDATED', req => req.params.id),
  async (req: Request, res: Response) => {
    let youtube: youtube_v3.Youtube

    // 🔐 HARD AUTH GUARD
    try {
      youtube = getYoutubeClient(req)
    } catch {
      return res.status(401).json({
        error: 'AUTH_REQUIRED',
        message: 'Please sign in with Google to edit this video'
      })
    }

    try {
      const videoId = extractVideoId(req.params.id)
      if (!videoId) {
        return res.status(400).json({ error: 'INVALID_VIDEO_ID' })
      }

      const { title, description } = req.body as {
        title?: string
        description?: string
      }

      if (!title && !description) {
        return res.status(400).json({
          error: 'INVALID_REQUEST',
          message: 'Title or description is required'
        })
      }

      // 1️⃣ Fetch existing snippet (MANDATORY)
      const existing = await youtube.videos.list({
        part: ['snippet'],
        id: [videoId]
      })

      const snippet = existing.data.items?.[0]?.snippet
      if (!snippet) {
        return res.status(404).json({ error: 'VIDEO_NOT_FOUND' })
      }

      // 2️⃣ Update safely
      await youtube.videos.update({
        part: ['snippet'],
        requestBody: {
          id: videoId,
          snippet: {
            ...snippet,
            title: title ?? snippet.title,
            description: description ?? snippet.description
          }
        }
      })

      res.json({ success: true })
    } catch (err) {
      console.error('UPDATE VIDEO ERROR:', err)
      res.status(500).json({ error: 'FAILED_TO_UPDATE_VIDEO' })
    }
  }
)

export default router
