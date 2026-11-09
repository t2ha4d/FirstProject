import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/global.css'
import App from './app/App.tsx'

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('Missing #root element in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
