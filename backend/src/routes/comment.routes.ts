import { Router, Request, Response } from 'express'
import { getYoutubeClient } from '../services/youtube.js'
import { eventLoggerMiddleware } from '../middleware/eventLogger.middleware.js'

const router = Router()

// ===============================
// 🔧 Normalize YouTube Video ID
// ===============================
function extractVideoId(input: string): string {
  if (!input) return input

  if (input.includes('youtu.be/')) {
    return input.split('youtu.be/')[1].split('?')[0]
  }

  if (input.includes('watch?v=')) {
    return input.split('watch?v=')[1].split('&')[0]
  }

  return input.trim()
}

// ===============================
// 🔐 AUTH HELPER (SESSION-BASED)
// ===============================
function getAuthYoutubeOrFail(req: Request, res: Response) {
  try {
    return getYoutubeClient(req)
  } catch {
    res.status(401).json({
      error: 'AUTH_REQUIRED',
      message: 'Please sign in with Google first'
    })
    return null
  }
}

// ===============================
// 💬 FETCH TOP-LEVEL COMMENTS
// ===============================
router.get(
  '/:videoId',
  eventLoggerMiddleware('COMMENTS_FETCHED', req => req.params.videoId),
  async (req, res) => {
    const youtube = getAuthYoutubeOrFail(req, res)
    if (!youtube) return

    try {
      const videoId = extractVideoId(req.params.videoId)

      const response = await youtube.commentThreads.list({
        part: ['snippet'],
        videoId
      })

      const comments =
        response.data.items?.map(c => ({
          id: c.id!,
          text: c.snippet?.topLevelComment?.snippet?.textDisplay
        })) ?? []

      res.json(comments)
    } catch (err) {
      console.error('FETCH COMMENTS ERROR:', err)
      res.status(500).json({ error: 'FAILED_TO_FETCH_COMMENTS' })
    }
  }
)

// ===============================
// ➕ ADD TOP-LEVEL COMMENT
// ===============================
router.post(
  '/',
  eventLoggerMiddleware('COMMENT_ADDED', req => req.body.videoId),
  async (req, res) => {
    const youtube = getAuthYoutubeOrFail(req, res)
    if (!youtube) return

    try {
      let { videoId, text } = req.body
      videoId = extractVideoId(videoId)

      await youtube.commentThreads.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            videoId,
            topLevelComment: {
              snippet: { textOriginal: text }
            }
          }
        }
      })

      res.json({ success: true })
    } catch (err) {
      console.error('ADD COMMENT ERROR:', err)
      res.status(500).json({ error: 'FAILED_TO_ADD_COMMENT' })
    }
  }
)

// ===============================
// ❌ DELETE COMMENT
// ===============================
router.delete(
  '/:id',
  eventLoggerMiddleware('COMMENT_DELETED', req => req.params.id),
  async (req, res) => {
    const youtube = getAuthYoutubeOrFail(req, res)
    if (!youtube) return

    try {
      await youtube.comments.delete({ id: req.params.id })
      res.json({ success: true })
    } catch (err) {
      console.error('DELETE COMMENT ERROR:', err)
      res.status(500).json({ error: 'FAILED_TO_DELETE_COMMENT' })
    }
  }
)

// ===============================
// 💬 FETCH REPLIES
// ===============================
router.get(
  '/replies/:commentId',
  eventLoggerMiddleware('REPLIES_FETCHED', req => req.params.commentId),
  async (req, res) => {
    const youtube = getAuthYoutubeOrFail(req, res)
    if (!youtube) return

    try {
      const response = await youtube.comments.list({
        part: ['snippet'],
        parentId: req.params.commentId
      })

      const replies =
        response.data.items?.map(r => ({
          id: r.id!,
          text: r.snippet?.textDisplay
        })) ?? []

      res.json(replies)
    } catch (err) {
      console.error('FETCH REPLIES ERROR:', err)
      res.status(500).json({ error: 'FAILED_TO_FETCH_REPLIES' })
    }
  }
)

// ===============================
// ↩️ REPLY TO COMMENT
// ===============================
router.post(
  '/reply',
  eventLoggerMiddleware('COMMENT_REPLIED', req => req.body.parentId),
  async (req, res) => {
    const youtube = getAuthYoutubeOrFail(req, res)
    if (!youtube) return

    try {
      const { parentId, text } = req.body

      await youtube.comments.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            parentId,
            textOriginal: text
          }
        }
      })

      res.json({ success: true })
    } catch (err) {
      console.error('REPLY COMMENT ERROR:', err)
      res.status(500).json({ error: 'FAILED_TO_REPLY_COMMENT' })
    }
  }
)

export default router
