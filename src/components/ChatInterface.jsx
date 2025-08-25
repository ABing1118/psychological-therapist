import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Home, MoreVertical, Heart, Phone, GamepadIcon, ClipboardList, Image } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../contexts/ChatContext'
import { useBackground } from '../contexts/BackgroundContext'
import MessageBubble from './MessageBubble'
import EmojiMessage from './EmojiMessage'
import MusicCard from './MusicCard'
import TypingIndicator from './TypingIndicator'
import ServicePanel from './ServicePanel'
import QuickReplyOptions from './QuickReplyOptions'
import PrivacyNotice from './PrivacyNotice'
import WearableDataInput from './WearableDataInput'
import BackgroundSelector from './BackgroundSelector'
import CharacterDisplay from './CharacterDisplay'

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [showServices, setShowServices] = useState(false)
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const { currentBackground } = useBackground()
  
  // 布局调整状态
  const [chatWidth, setChatWidth] = useState(40) // 聊天区域宽度百分比
  const [sidebarWidth, setSidebarWidth] = useState(15) // 右侧栏宽度百分比
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(null)
  
  const { 
    messages, 
    isTyping, 
    userRiskLevel, 
    sendMessage, 
    clearChat,
    handleQuickReply,
    wearableDataRequest,
    submitWearableData,
    closeWearableDataRequest,
    // Demo相关功能
    isDemoMode,
    startDemo,
    stopDemo,
    resetDemo,
    getCurrentExpectedInput,
    getDemoProgress
  } = useChat()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // 穿戴数据请求时自动调整布局
  useEffect(() => {
    if (wearableDataRequest.isRequested) {
      // 当穿戴数据请求时，增加右侧栏宽度，压缩聊天区域
      setChatWidth(30) // 聊天区域压缩到30%
      setSidebarWidth(25) // 右侧栏扩展到25%
    } else {
      // 恢复默认布局
      setChatWidth(40)
      setSidebarWidth(15)
    }
  }, [wearableDataRequest.isRequested])

  // 拖拽处理函数
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    
    const containerWidth = window.innerWidth
    const mouseX = e.clientX
    const characterWidth = 40 // 人物区域固定40%
    const leftOffset = (containerWidth * (5 + characterWidth)) / 100 // 5%预留 + 40%人物
    
    // 计算新的聊天区域宽度百分比
    const newChatWidthPx = mouseX - leftOffset
    const newChatWidthPercent = (newChatWidthPx / containerWidth) * 100
    
    // 设置最小和最大宽度限制
    const minChatWidth = 20 // 聊天区域最小20%
    const maxChatWidth = 60 // 聊天区域最大60%
    const minSidebarWidth = 10 // 右侧栏最小10%
    const maxSidebarWidth = 35 // 右侧栏最大35%
    
    const clampedChatWidth = Math.max(minChatWidth, Math.min(maxChatWidth, newChatWidthPercent))
    const newSidebarWidth = 100 - 5 - 40 - clampedChatWidth // 总宽度100% - 预留5% - 人物40% - 聊天区域
    
    if (newSidebarWidth >= minSidebarWidth && newSidebarWidth <= maxSidebarWidth) {
      setChatWidth(clampedChatWidth)
      setSidebarWidth(newSidebarWidth)
    }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // 移除自动发送欢迎消息的逻辑，因为现在使用mock数据

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isTyping) {
      sendMessage(inputMessage)
      setInputMessage('')
    }
  }

  const handleKeyDown = (e) => {
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
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* 全屏背景图片 */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${currentBackground.path})`,
          zIndex: -1
        }}
      />
      
      {/* 背景遮罩层 - 确保内容可读性 */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-[0.5px]" style={{ zIndex: -1 }} />
      
      <div className="h-screen flex flex-col chat-container relative z-10">
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
          {/* Demo控制按钮 */}
          {isDemoMode ? (
            <>
              <motion.button
                onClick={stopDemo}
                className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-700 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="停止Demo模式"
              >
                停止Demo
              </motion.button>
              <motion.button
                onClick={resetDemo}
                className="px-3 py-1 text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-700 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="重置Demo"
              >
                重置
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={startDemo}
              className="px-3 py-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-700 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="开始Demo演示"
            >
              开始Demo
            </motion.button>
          )}
          
          <motion.button
            onClick={() => setShowBackgroundSelector(true)}
            className="p-2 hover:bg-white/50 rounded-full transition-colors group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="更换背景"
          >
            <Image className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
          </motion.button>
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
        {/* 左侧预留空间 - 5% */}
        <div className="hidden lg:flex w-[5%] p-2">
          {/* 预留给未来内容的空组件 */}
          <div className="w-full h-full flex items-center justify-center">
            {/* 可以放置导航菜单或其他功能 */}
          </div>
        </div>

        {/* 人物区域 - 40% */}
        <div className="hidden lg:flex w-[40%] p-6">
          <CharacterDisplay />
        </div>

        {/* 中央对话区域 - 动态宽度 */}
        <div className="flex-1 flex flex-col" style={{ width: `${chatWidth}%` }}>
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {/* 隐私保密提示 - 位于消息流顶部 */}
            <PrivacyNotice />
            
            <AnimatePresence>
              {messages.map((message, index) => (
                message.type === 'emoji' ? (
                  <EmojiMessage 
                    key={message.id || index} 
                    message={message}
                  />
                ) : message.type === 'music' ? (
                  <MusicCard 
                    key={message.id || index} 
                    message={message}
                  />
                ) : (
                  <MessageBubble 
                    key={message.id || index} 
                    message={message}
                    onQuickReplySelect={handleQuickReply}
                  />
                )
              ))}
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Demo提示面板 */}
          {isDemoMode && (
            <motion.div 
              className="bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm rounded-lg p-3 mx-4 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-blue-800 mb-1">Demo模式进行中</p>
                  {getCurrentExpectedInput() && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">请输入：</span>
                      <span 
                        className="bg-yellow-100 hover:bg-yellow-200 px-2 py-0.5 rounded text-xs cursor-pointer transition-colors select-all"
                        onClick={async (e) => {
                          try {
                            await navigator.clipboard.writeText(getCurrentExpectedInput())
                            // 显示复制成功提示（可选）
                            const span = e.target
                            const originalText = span.textContent
                            span.textContent = '已复制!'
                            span.className = 'bg-green-100 hover:bg-green-200 px-2 py-0.5 rounded text-xs cursor-pointer transition-colors select-all'
                            setTimeout(() => {
                              span.textContent = originalText
                              span.className = 'bg-yellow-100 hover:bg-yellow-200 px-2 py-0.5 rounded text-xs cursor-pointer transition-colors select-all'
                            }, 1000)
                          } catch (err) {
                            console.error('复制失败:', err)
                          }
                        }}
                        title="点击复制文本"
                      >
                        {getCurrentExpectedInput()}
                      </span>
                    </p>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-xs text-gray-500">
                    {getDemoProgress().currentStep} / {getDemoProgress().totalSteps}
                  </div>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${getDemoProgress().progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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
                  onKeyDown={handleKeyDown}
                  placeholder="在这里输入你想说的话..."
                  className="w-full p-4 pr-12 bg-white/75 backdrop-blur-md rounded-2xl border border-warm-200/40 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 outline-none resize-none max-h-32 shadow-lg smooth-transition"
                  rows="1"
                  disabled={isTyping}
                  style={{ minHeight: '52px' }}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed smooth-transition shadow-lg warm-glow"
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
        
        {/* 拖拽分割条 */}
        <div 
          className={`hidden lg:flex w-1 bg-gray-300/50 hover:bg-gray-400/70 cursor-col-resize transition-colors ${
            isDragging ? 'bg-blue-400/70' : ''
          }`}
          onMouseDown={handleMouseDown}
          ref={dragRef}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-0.5 h-8 bg-gray-400 rounded-full opacity-60"></div>
          </div>
        </div>
        
        {/* 右侧功能区域 - 动态宽度 */}
        <div 
          className="hidden lg:flex p-6 bg-white/30 backdrop-blur-md" 
          style={{ width: `${sidebarWidth}%` }}
        >
          {wearableDataRequest.isRequested ? (
            /* 穿戴数据输入组件 */
            <div className="w-full">
              <WearableDataInput 
                onSubmit={submitWearableData}
                onClose={closeWearableDataRequest}
              />
            </div>
          ) : (
            /* 默认的功能展示区域 */
            <div className="w-full flex flex-col justify-center space-y-8">
              {/* 安全陪伴 */}
              <div className="text-center space-y-4 opacity-70">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-warm-100 rounded-full flex items-center justify-center shadow-md">
                  <Heart className="w-10 h-10 text-primary-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">安全陪伴</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    我们在这里倾听<br />
                    你的每一个感受
                  </p>
                </div>
              </div>

              {/* 分割线 */}
              <div className="border-t border-gray-300/50 mx-8"></div>

              {/* 24/7 支持 */}
              <div className="text-center space-y-4 opacity-70">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-warm-100 to-primary-100 rounded-full flex items-center justify-center shadow-md">
                  <Phone className="w-10 h-10 text-warm-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">24/7 支持</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    紧急时刻<br />
                    我们随时为你提供帮助
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 服务面板 */}
      <AnimatePresence>
        {showServices && (
          <ServicePanel onClose={() => setShowServices(false)} />
        )}
      </AnimatePresence>

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

      {/* 背景选择器 */}
      <BackgroundSelector 
        isOpen={showBackgroundSelector} 
        onClose={() => setShowBackgroundSelector(false)} 
      />
      </div>
    </div>
  )
}

export default ChatInterface