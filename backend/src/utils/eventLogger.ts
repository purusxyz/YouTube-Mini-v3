import { EventLog } from '../models/EventLog.js'

interface LogParams {
  action: string
  videoId?: string
  endpoint: string
  method: string
  status: 'SUCCESS' | 'FAILED'
  errorMessage?: string
}

export const logEvent = async (data: LogParams) => {
  try {
    await EventLog.create(data)
  } catch (err) {
    console.error('Event logging failed:', err)
  }
}
