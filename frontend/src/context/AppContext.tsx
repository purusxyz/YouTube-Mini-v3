import { createContext, useContext, useState } from 'react'

interface AppState {
  videoId: string
  setVideoId: (id: string) => void
}

const AppContext = createContext<AppState | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoId, setVideoId] = useState('')
  return (
    <AppContext.Provider value={{ videoId, setVideoId }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)!
