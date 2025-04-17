import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from '../src/components/ui/sonner'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster closeButton />
  </>
)
