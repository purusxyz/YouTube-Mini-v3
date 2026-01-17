import { useEffect, useState } from 'react'
import axios from 'axios'

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    axios
      .get('/auth/me', { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false))
  }, [])

  return { authenticated, loading }
}
