import React from 'react'
import ReactDOM from 'react-dom/client'
import { loader } from '@monaco-editor/react'
import App from './App'
import './index.css'

// In production (extension), Monaco files are bundled locally.
// In dev, fall back to CDN so Vite doesn't need to serve the files.
if (!import.meta.env.DEV) {
  loader.config({ paths: { vs: './monaco-editor/min/vs' } })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
