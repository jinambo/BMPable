import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ImageProvider from './components/ImageProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ImageProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ImageProvider>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
