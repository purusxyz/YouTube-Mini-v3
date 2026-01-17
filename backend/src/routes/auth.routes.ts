import { Router } from 'express'
import { createOAuthClient, getAuthUrl } from '../services/googleAuth.js'

const router = Router()

const FRONTEND_URL = process.env.FRONTEND_URL as string

if (!FRONTEND_URL) {
  throw new Error('❌ FRONTEND_URL is not defined in environment variables')
}

// ===============================
// STEP 1: Redirect to Google OAuth
// ===============================
router.get('/google', (_req, res) => {
  const url = getAuthUrl()
  console.log('🔐 Redirecting to Google OAuth:', url)
  res.redirect(url)
})

// ===============================
// STEP 2: Google OAuth Callback
// ===============================
router.get('/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string

    if (!code) {
      return res.status(400).send('Authorization code missing')
    }

    // 🔐 Create fresh OAuth client
    const oauth2Client = createOAuthClient()

    // 🔁 Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // 🍪 Store tokens securely in cookie
    res.cookie('tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    })

    console.log('✅ Google OAuth success – tokens stored')

    // 🔄 Redirect to correct frontend (LOCAL or PROD)
    res.redirect(FRONTEND_URL)
  } catch (err) {
    console.error('❌ Google OAuth Error:', err)
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`)
  }
})

// ===============================
// 🔍 AUTH STATUS (Frontend helper)
// ===============================
router.get('/status', (req, res) => {
  res.json({
    authenticated: Boolean(req.cookies?.tokens),
  })
})

// ===============================
// 🚪 LOGOUT
// ===============================
router.post('/logout', (_req, res) => {
  res.clearCookie('tokens', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  })

  res.json({ success: true })
})

export default router
