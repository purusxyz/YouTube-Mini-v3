import { Router } from 'express'
import { createOAuthClient, getAuthUrl } from '../services/googleAuth.js'

const router = Router()

// ===============================
// STEP 1: Redirect to Google OAuth
// ===============================
router.get('/google', (_req, res) => {
  const url = getAuthUrl()
  console.log('OAUTH URL SENT TO BROWSER:', url)
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

    // ✅ STORE TOKENS IN SESSION (SOURCE OF TRUTH)
   res.cookie('tokens', JSON.stringify(tokens), {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
})


    console.log('✅ Google OAuth success – tokens stored in session')

    // 🔄 Redirect back to frontend
    res.redirect('http://localhost:5173')
  } catch (err) {
    console.error('❌ Google OAuth Error:', err)
    res.status(500).send('Google OAuth failed')
  }
})

// ===============================
// 🔍 AUTH STATUS (Frontend helper)
// ===============================
router.get('/status', (req, res) => {
  res.json({
    authenticated: Boolean(req.cookies?.tokens)
  })
})

// ===============================
// 🚪 LOGOUT
// ===============================
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).json({ error: 'Logout failed' })
    }

    res.clearCookie('connect.sid')
    res.json({ success: true })
  })
})

export default router
