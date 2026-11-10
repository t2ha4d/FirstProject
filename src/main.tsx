import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/global.css'
import './shared/styles/tailwind.css'
import App from './app/App.tsx'
import { ApiError } from './shared/api/client'

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('Missing #root element in index.html')
}

// Failed API requests are caught by an error boundary and shown with "Try again", so React
// does not need to log them. Any other caught error is still logged, because it is a bug.
createRoot(rootElement, {
  onCaughtError(error, errorInfo) {
    if (!(error instanceof ApiError)) console.error(error, errorInfo.componentStack)
  },
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
