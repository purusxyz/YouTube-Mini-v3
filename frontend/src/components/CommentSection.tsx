import { useEffect, useState } from 'react'
import {
  fetchComments,
  addComment as addCommentApi,
  replyToComment as replyApi,
  deleteComment as deleteApi
} from '../services/api'
import { useApp } from '../context/AppContext'

interface Comment {
  id: string
  text: string
}

export default function CommentSection() {
  const { videoId } = useApp()

  const [comments, setComments] = useState<Comment[]>([])
  const [replies, setReplies] = useState<Record<string, Comment[]>>({})
  const [text, setText] = useState('')
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // ===============================
  // 🔹 LOAD COMMENTS
  // ===============================
  const loadComments = async () => {
    if (!videoId) return
    try {
      setLoading(true)
      const res = await fetchComments(videoId)
      setComments(res.data)
    } catch (err) {
      console.error('Failed to load comments', err)
    } finally {
      setLoading(false)
    }
  }

  const loadReplies = async (commentId: string) => {
    try {
      const res = await fetchComments(`replies/${commentId}`)
      setReplies(prev => ({ ...prev, [commentId]: res.data }))
    } catch (err) {
      console.error('Failed to load replies', err)
    }
  }

  useEffect(() => {
    loadComments()
  }, [videoId])

  // ===============================
  // 🔹 ADD COMMENT
  // ===============================
  const handleAddComment = async () => {
    if (!videoId || !text.trim()) return

    try {
      await addCommentApi({ videoId, text: text.trim() })
      setText('')
      loadComments()
    } catch (err) {
      console.error('Failed to add comment', err)
    }
  }

  // ===============================
  // 🔹 REPLY
  // ===============================
  const handleReply = async (parentId: string) => {
    const reply = replyText[parentId]
    if (!reply?.trim()) return

    try {
      await replyApi({ parentId, text: reply.trim() })
      setReplyText(prev => ({ ...prev, [parentId]: '' }))
      loadReplies(parentId)
    } catch (err) {
      console.error('Failed to reply', err)
    }
  }

  // ===============================
  // 🔹 DELETE
  // ===============================
  const handleDelete = async (id: string) => {
    try {
      await deleteApi(id)
      loadComments()
    } catch (err) {
      console.error('Failed to delete comment', err)
    }
  }

  // ===============================
  // 🔹 UI
  // ===============================
  if (!videoId) {
    return (
      <div className="mt-8 text-zinc-400 text-sm">
        Sign in and paste a YouTube link to view comments.
      </div>
    )
  }

  return (
    <div className="mt-8 bg-zinc-900 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {/* Add Comment */}
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 bg-black p-3 rounded outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Add a public comment..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          disabled={!text.trim()}
          className="bg-blue-600 px-4 rounded disabled:opacity-50"
        >
          Comment
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-zinc-400">Loading comments...</p>
      )}

      {/* Empty */}
      {!loading && comments.length === 0 && (
        <p className="text-sm text-zinc-400">No comments yet.</p>
      )}

      {/* Comments */}
      <div className="space-y-6">
        {comments.map(c => (
          <div key={c.id} className="bg-black p-4 rounded-lg">
            <p className="text-sm">{c.text}</p>

            <div className="flex gap-4 mt-2 text-xs text-zinc-400">
              <button
                onClick={() => loadReplies(c.id)}
                className="hover:text-blue-400"
              >
                View replies
              </button>

              <button
                onClick={() => handleDelete(c.id)}
                className="hover:text-red-500"
              >
                Delete
              </button>
            </div>

            {/* Replies */}
            {replies[c.id]?.map(r => (
              <div
                key={r.id}
                className="ml-6 mt-3 p-3 bg-zinc-800 rounded"
              >
                <p className="text-xs">{r.text}</p>
              </div>
            ))}

            {/* Reply Input */}
            <div className="flex gap-2 mt-4 ml-6">
              <input
                className="flex-1 bg-zinc-800 p-2 rounded text-xs outline-none"
                placeholder="Reply..."
                value={replyText[c.id] || ''}
                onChange={e =>
                  setReplyText(prev => ({
                    ...prev,
                    [c.id]: e.target.value
                  }))
                }
              />
              <button
                onClick={() => handleReply(c.id)}
                className="bg-green-600 px-3 rounded text-xs"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
