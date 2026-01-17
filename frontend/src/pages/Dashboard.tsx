import { useApp } from '../context/AppContext'
import VideoCard from '../components/VideoCard'
import Notes from '../components/Notes'
import CommentSection from '../components/CommentSection'

function extractVideoId(input: string) {
  // youtu.be/VIDEO_ID
  if (input.includes('youtu.be/')) {
    return input.split('youtu.be/')[1].split('?')[0]
  }

  // youtube.com/watch?v=VIDEO_ID
  if (input.includes('watch?v=')) {
    return input.split('watch?v=')[1].split('&')[0]
  }

  // already an ID
  return input.trim()
}

export default function Dashboard() {
  const { videoId, setVideoId } = useApp()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <input
        className="w-full p-3 rounded bg-zinc-900"
        placeholder="Paste YouTube Video URL or ID"
        onChange={e => setVideoId(extractVideoId(e.target.value))}
      />

      {videoId && (
        <>
          <VideoCard />
          <CommentSection />
          <Notes />
        </>
      )}
    </div>
  )
}
