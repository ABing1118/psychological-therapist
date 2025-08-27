import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Home, Heart, Phone, GamepadIcon, ClipboardList, Image, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../contexts/ChatContext'
import { useBackground } from '../contexts/BackgroundContext'
import MessageBubble from './MessageBubble'
import EmojiMessage from './EmojiMessage'
import MusicCard from './MusicCard'
import TypingIndicator from './TypingIndicator'
import QuickReplyOptions from './QuickReplyOptions'
import PrivacyNotice from './PrivacyNotice'
import WearableDataInput from './WearableDataInput'
import BackgroundSelector from './BackgroundSelector'
import CharacterDisplay from './CharacterDisplay'
import LeftSidebar from './LeftSidebar'
import EmergencyContactCard from './EmergencyContactCard'

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false)
  const [showEmergencyContact, setShowEmergencyContact] = useState(false)
  const [emergencyContactType, setEmergencyContactType] = useState('crisis')
  const [showWarningBubble, setShowWarningBubble] = useState(true)
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

  // 监听来自 ChatContext 的紧急联系事件
  useEffect(() => {
    const handleShowEmergencyContact = (event) => {
      setEmergencyContactType(event.detail.type)
      setShowEmergencyContact(true)
    }

    window.addEventListener('showEmergencyContact', handleShowEmergencyContact)
    
    return () => {
      window.removeEventListener('showEmergencyContact', handleShowEmergencyContact)
    }
  }, [])

  // 穿戴数据请求时自动调整布局
  useEffect(() => {
    if (wearableDataRequest.isRequested) {
      // 当穿戴数据请求时，增加右侧栏宽度，但保持聊天区域最小宽度
      setChatWidth(30) // 聊天区域保持30%，确保有足够空间
      setSidebarWidth(25) // 右侧栏扩展到25%，给穿戴数据表单更多空间
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
    const leftSidebarWidth = 5 // 左侧栏估计5%宽度 (16px图标栏 + 可能的展开面板)
    const leftOffset = (containerWidth * (leftSidebarWidth + characterWidth)) / 100 // 左侧栏 + 人物区域
    
    // 计算新的聊天区域宽度百分比
    const newChatWidthPx = mouseX - leftOffset
    const newChatWidthPercent = (newChatWidthPx / containerWidth) * 100
    
    // 设置最小和最大宽度限制
    const minChatWidth = 25 // 聊天区域最小25%，确保对话框有足够空间
    const maxChatWidth = 60 // 聊天区域最大60%
    const minSidebarWidth = 10 // 右侧栏最小10%
    const maxSidebarWidth = 35 // 右侧栏最大35%
    
    const clampedChatWidth = Math.max(minChatWidth, Math.min(maxChatWidth, newChatWidthPercent))
    const newSidebarWidth = 100 - leftSidebarWidth - characterWidth - clampedChatWidth // 总宽度100% - 左侧栏 - 人物40% - 聊天区域
    
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
            <Home className="w-5 h-5 text-gray-700" />
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
            <Image className="w-5 h-5 text-gray-700 group-hover:text-primary-600 transition-colors" />
          </motion.button>
        </div>
      </motion.header>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-hidden flex">
        {/* 左侧栏 - VSCode风格 */}
        <div className="hidden lg:flex">
          <LeftSidebar />
        </div>

        {/* 人物区域 - 40% */}
        <div className="hidden lg:flex w-[40%] p-6 flex-col">
          {/* 高风险警告气泡 - 显示在人物上方 */}
          <AnimatePresence>
            {(userRiskLevel === 'high' || userRiskLevel === 'critical') && showWarningBubble && (
              <motion.div
                className="mb-4 flex justify-center"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.5
                }}
              >
                {/* 气泡容器 */}
                <div className="relative max-w-xs">
                  {/* 主气泡 */}
                  <div className="relative bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300/70 rounded-2xl shadow-xl overflow-hidden">
                    {/* 关闭按钮 */}
                    <button
                      onClick={() => setShowWarningBubble(false)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-sm z-10 group"
                    >
                      <X size={12} className="text-red-600 group-hover:text-red-700" />
                    </button>
                    
                    {/* 内容区域 */}
                    <div className="p-4 space-y-3">
                      {/* 警告图标和文字 */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                          <AlertTriangle size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-bold text-red-800 leading-tight">
                            我很关心你的安全
                          </p>
                          <p className="text-xs text-red-700 mt-1 leading-tight">
                            如果你现在处于危险中，请立即寻求帮助
                          </p>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex justify-center">
                        <motion.button 
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEmergencyContactType('crisis')
                            setShowEmergencyContact(true)
                          }}
                        >
                          获得帮助
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* 气泡尖角 */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-red-300/70"></div>
                    <div className="absolute -top-0.5 left-0.5 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[11px] border-t-red-50"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 人物显示组件 */}
          <CharacterDisplay />
        </div>

        {/* 中央对话区域 - 动态宽度 */}
        <div className="flex-1 flex flex-col" style={{ width: `${chatWidth}%`, minWidth: '320px' }}>
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

          {/* Demo提示面板 - 录制时隐藏 */}
          {false && isDemoMode && (
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
          </motion.div>
        </div>
        
        {/* 拖拽分割条 */}
        <div 
          className={`hidden lg:flex w-1 bg-gray-300/50 hover:bg-gray-400/70 cursor-col-resize transition-colors ${
            isDragging ? 'bg-blue-400/70' : ''
          } ${chatWidth <= 25 ? 'bg-orange-400/70' : ''}`}
          onMouseDown={handleMouseDown}
          ref={dragRef}
          title={chatWidth <= 25 ? '聊天区域已达最小宽度' : '拖拽调整布局'}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-0.5 h-8 rounded-full opacity-60 transition-colors ${
              chatWidth <= 25 ? 'bg-orange-500' : 'bg-gray-400'
            }`}></div>
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
                  <h3 className="text-lg font-semibold text-gray-800">匿名树洞</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    我们在这里倾听<br />
                    你的每一个感受
                  </p>
                </div>
              </div>

              {/* 分割线 */}
              <div className="border-t border-gray-300/50 mx-8"></div>

              {/* 24/7 支持 */}
              <motion.div 
                className="text-center space-y-4 opacity-70 hover:opacity-100 cursor-pointer transition-all duration-200 p-4 rounded-lg hover:bg-white/20"
                onClick={() => window.open('tel:400-161-9995')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="拨打24小时心理危机干预热线"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-warm-100 to-primary-100 rounded-full flex items-center justify-center shadow-md">
                  <Phone className="w-10 h-10 text-warm-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">24/7 支持</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    紧急时刻<br />
                    我们随时为你提供帮助
                  </p>
                  <div className="mt-3">
                    <span className="text-xs text-blue-600 font-medium">点击拨打热线</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>



      {/* 背景选择器 */}
      <BackgroundSelector 
        isOpen={showBackgroundSelector} 
        onClose={() => setShowBackgroundSelector(false)} 
      />

      {/* 紧急联系卡片 */}
      <EmergencyContactCard
        visible={showEmergencyContact}
        emergencyType={emergencyContactType}
        onClose={() => setShowEmergencyContact(false)}
      />
      </div>
    </div>
  )
}

export default ChatInterface