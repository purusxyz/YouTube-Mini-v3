import axios from 'axios'

// ===============================
// 🌐 Axios Instance
// ===============================
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true
})
// ===============================
// 🔐 Global Auth Error Handler
// ===============================
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn('AUTH REQUIRED – user not logged in')
      // Optional UX hook (do NOT auto-refresh in prod)
      // window.location.reload()
    }
    return Promise.reject(err)
  }
)

// ===============================
// 💬 COMMENTS API
// ===============================
export const fetchComments = (videoId: string) =>
  api.get(`/comment/${videoId}`)

export const addComment = (data: {
  videoId: string
  text: string
}) => api.post('/comment', data)

export const replyToComment = (data: {
  parentId: string
  text: string
}) => api.post('/comment/reply', data)

export const deleteComment = (id: string) =>
  api.delete(`/comment/${id}`)

// ===============================
// 🎥 VIDEO API
// ===============================
export const fetchVideo = (videoId: string) =>
  api.get(`/video/${videoId}`)

/**
 * 🔹 Update video title & description
 * Requires Google OAuth (user must be authenticated)
 */
export const updateVideoMetadata = (data: {
  videoId: string
  title?: string
  description?: string
}) =>
  api.put(`/video/${data.videoId}`, {
    title: data.title,
    description: data.description
  })
