import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Home, MoreVertical, Heart, Phone, GamepadIcon, ClipboardList } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../contexts/ChatContext'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ServicePanel from './ServicePanel'

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [showServices, setShowServices] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  
  const { 
    messages, 
    isTyping, 
    userRiskLevel, 
    sendMessage, 
    clearChat 
  } = useChat()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        type: 'bot',
        content: '你好，我很高兴你愿意和我聊聊。我是来倾听的，如果你愿意，可以告诉我今天你的感受如何？',
        sender: 'assistant'
      }
      
      setTimeout(() => {
        sendMessage(welcomeMessage.content)
      }, 1000)
    }
  }, [])

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isTyping) {
      sendMessage(inputMessage)
      setInputMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'  
      case 'high': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  const getRiskLevelText = (level) => {
    switch (level) {
      case 'low': return '状态良好'
      case 'medium': return '需要关注'
      case 'high': return '需要支持'
      case 'critical': return '紧急关注'
      default: return '评估中'
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-warm-50">
      {/* 头部导航 */}
      <motion.header 
        className="glass-effect border-b border-white/20 px-4 py-3 flex items-center justify-between"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5 text-gray-600" />
          </motion.button>
          <div>
            <h1 className="font-semibold text-gray-800">心理健康助手</h1>
            <p className={`text-xs ${getRiskLevelColor(userRiskLevel)}`}>
              {getRiskLevelText(userRiskLevel)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowServices(!showServices)}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </motion.header>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble key={message.id || index} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <motion.div 
            className="glass-effect border-t border-white/20 p-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="在这里输入你想说的话..."
                  className="w-full p-3 pr-12 bg-white rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none max-h-32"
                  rows="1"
                  disabled={isTyping}
                  style={{ minHeight: '48px' }}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-2 bottom-2 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-3 space-x-4">
              <motion.button
                className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="w-3 h-3" />
                <span>情感支持</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-3 h-3" />
                <span>紧急热线</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* 服务面板 */}
        <AnimatePresence>
          {showServices && (
            <ServicePanel onClose={() => setShowServices(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* 高风险警告 */}
      <AnimatePresence>
        {(userRiskLevel === 'high' || userRiskLevel === 'critical') && (
          <motion.div
            className="fixed bottom-20 left-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">我很关心你的安全</p>
                <p className="text-sm opacity-90">如果你现在处于危险中，请立即寻求帮助</p>
              </div>
              <motion.button 
                className="bg-white text-red-500 px-4 py-2 rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                获得帮助
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatInterface