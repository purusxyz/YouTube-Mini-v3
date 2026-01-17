import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'

export default function Notes() {
  const { videoId } = useApp()
  const [notes, setNotes] = useState<string[]>([])
  const [text, setText] = useState('')

  const loadNotes = async () => {
    const res = await api.get(`/note/${videoId}`)
    setNotes(res.data)
  }

  useEffect(() => {
    loadNotes()
  }, [videoId])

  const addNote = async () => {
    await api.post('/note', { videoId, text })
    setText('')
    loadNotes()
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Private Notes</h2>

      <textarea
        className="w-full bg-black p-3 rounded mb-3"
        placeholder="Ideas to improve this video..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button
        onClick={addNote}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Save Note
      </button>

      <ul className="mt-4 space-y-2">
        {notes.map((n, i) => (
          <li key={i} className="bg-black p-3 rounded text-sm">
            {n}
          </li>
        ))}
      </ul>
    </div>
  )
}
