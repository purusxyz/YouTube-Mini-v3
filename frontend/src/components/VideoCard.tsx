import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { fetchVideo, updateVideoMetadata } from '../services/api'
import { useAuth } from '../hooks/useAuth'
// import CommentSection from './CommentSection'

interface Video {
  title: string
  description: string
  thumbnail: string
}

export default function VideoCard() {
  const { videoId } = useApp()
  const { authenticated, loading: authLoading } = useAuth()

  const [video, setVideo] = useState<Video | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ===============================
  // 🔹 LOAD VIDEO DETAILS (PUBLIC)
  // ===============================
  useEffect(() => {
    if (!videoId) return

    const loadVideo = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetchVideo(videoId)
        setVideo(res.data)
        setTitle(res.data.title)
        setDescription(res.data.description)
      } catch (err) {
        console.error('FETCH VIDEO ERROR:', err)
        setError('Failed to load video')
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [videoId])

  // ===============================
  // 🔹 SAVE TITLE & DESCRIPTION (AUTH)
  // ===============================
  const saveChanges = async () => {
    if (!videoId || !video || !authenticated) return

    // ⛔ Skip if nothing changed
    if (
      title.trim() === video.title &&
      description.trim() === video.description
    ) {
      return
    }

    try {
      setSaving(true)
      setError(null)

      await updateVideoMetadata({
        videoId,
        title: title.trim(),
        description: description.trim()
      })

      // Optimistic UI update
      setVideo({
        ...video,
        title: title.trim(),
        description: description.trim()
      })
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Please sign in with Google to edit this video')
      } else {
        setError('Failed to update video')
      }
    } finally {
      setSaving(false)
    }
  }

  // ===============================
  // 🔹 UI STATES
  // ===============================
  if (loading) {
    return (
      <div className="bg-zinc-900 p-6 rounded-xl text-zinc-400">
        Loading video...
      </div>
    )
  }

  if (!video) return null

  return (
    <div className="bg-zinc-900 rounded-xl p-6 space-y-5">
      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt="Video thumbnail"
        className="rounded-lg w-full max-h-80 object-cover"
      />

      {/* Title */}
      {authenticated ? (
        <input
          className="w-full bg-black p-3 rounded text-lg outline-none focus:ring-1 focus:ring-red-500"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      ) : (
        <h2 className="text-xl font-semibold">{video.title}</h2>
      )}

      {/* Description */}
      {authenticated ? (
        <textarea
          className="w-full bg-black p-3 rounded min-h-30 outline-none focus:ring-1 focus:ring-red-500"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      ) : (
        <p className="text-zinc-300 whitespace-pre-wrap">
          {video.description}
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Save Button */}
      {authenticated && (
        <button
          onClick={saveChanges}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      )}

      {/* Login Hint */}
      {!authenticated && !authLoading && (
        <p className="text-sm text-zinc-400">
          🔐 Sign in with Google to edit title or description
        </p>
      )}

      {/* Comments */}
      {/* <CommentSection /> */}
    </div>
  )
}
