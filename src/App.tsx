import React from 'react'
import { AudioWorkspace } from './components/AudioWorkspace'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="daw-theme">
      <div className="min-h-screen bg-gray-950 text-white">
        <AudioWorkspace />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid #374151'
            }
          }}
        />
      </div>
    </ThemeProvider>
  )
}

export default App