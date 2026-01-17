import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { AppProvider } from './context/AppContext'
import axios from 'axios'

const isProd = import.meta.env.PROD

axios.defaults.baseURL = isProd
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000'

axios.defaults.withCredentials = true



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
)
