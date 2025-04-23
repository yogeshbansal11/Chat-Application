import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from '../src/components/ui/sonner'
import { SocketProvider } from './context/SocketContext'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
    <Toaster closeButton />
  </SocketProvider>
)
