import { Router } from 'express'
import { Note } from '../models/Note.js'
import { eventLoggerMiddleware } from '../middleware/eventLogger.middleware.js'

const router = Router()

router.get(
  '/:videoId',
  eventLoggerMiddleware('NOTES_FETCHED', req => req.params.videoId),
  async (req, res) => {
    const notes = await Note.find({ videoId: req.params.videoId })
    res.json(notes.map(n => n.text))
  }
)

router.post(
  '/',
  eventLoggerMiddleware('NOTE_CREATED', req => req.body.videoId),
  async (req, res) => {
    const { videoId, text } = req.body
    await Note.create({ videoId, text })
    res.json({ success: true })
  }
)

export default router
