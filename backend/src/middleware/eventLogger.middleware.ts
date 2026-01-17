import { Request, Response, NextFunction } from 'express'
import { logEvent } from '../utils/eventLogger.js'

export const eventLoggerMiddleware =
  (action: string, getVideoId?: (req: Request) => string | undefined) =>
  async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      await logEvent({
        action,
        videoId: getVideoId?.(req),
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode < 400 ? 'SUCCESS' : 'FAILED'
      })
    })

    next()
  }
