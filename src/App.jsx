import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChatProvider } from './contexts/ChatContext'
import { BackgroundProvider } from './contexts/BackgroundContext'
import { CharacterProvider } from './contexts/CharacterContext'
import LandingPage from './components/LandingPage'
import ChatInterface from './components/ChatInterface'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-warm-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">正在加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <BackgroundProvider>
        <CharacterProvider>
          <ChatProvider>
            <div className="App min-h-screen">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </div>
          </ChatProvider>
        </CharacterProvider>
      </BackgroundProvider>
    </Router>
  )
}

export default App