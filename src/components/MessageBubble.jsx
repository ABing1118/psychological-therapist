import React from 'react'
import { motion } from 'framer-motion'
import { Heart, AlertTriangle, Phone, Check } from 'lucide-react'
import GameCard from './GameCard'

const MessageBubble = ({ message, onQuickReplySelect }) => {
  const isUser = message.type === 'user' || message.sender === 'user'
  
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderServiceButtons = (metadata) => {
    if (!metadata?.suggestedServices) return null
    
    return (
      <div className="mt-3 space-y-2">
        {metadata.suggestedServices.map((service, index) => (
          <motion.button
            key={index}
            className="flex items-center space-x-2 w-full p-2 bg-primary-50 hover:bg-primary-100 rounded-lg text-sm text-primary-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {service.type === 'emergency' && <Phone className="w-4 h-4" />}
            {service.type === 'assessment' && <AlertTriangle className="w-4 h-4" />}
            {service.type === 'support' && <Heart className="w-4 h-4" />}
            <span>{service.label}</span>
          </motion.button>
        ))}
      </div>
    )
  }

  const renderQuickReplyMessage = (message, onSelect) => {
    if (!message.isQuickReply || !message.quickReplyData) return null
    
    const { question, options, selectedOption } = message.quickReplyData
    
    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-600 mb-3">
          {question}
        </div>
        <div className="space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedOption && selectedOption.value === option.value
            
            return (
              <motion.button
                key={index}
                onClick={() => !selectedOption && onSelect(message.id, option.value, option.label)}
                disabled={!!selectedOption}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm relative ${
                  isSelected 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : selectedOption 
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                }`}
                whileHover={!selectedOption ? { scale: 1.02 } : {}}
                whileTap={!selectedOption ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="ml-2"
                    >
                      <Check className="w-5 h-5 text-green-600" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
        {!selectedOption && (
          <div className="text-xs text-gray-500 mt-2">
            点击选项快速回答，或在下方输入框自由表达
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-1' : 'order-2'}`}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-2 ml-1">
            <div className="w-7 h-7 bg-gradient-to-r from-primary-500 to-warm-500 rounded-full flex items-center justify-center shadow-md">
              <Heart className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs text-gray-600 font-medium">心理健康助手</span>
          </div>
        )}
        
        <motion.div
          className={`chat-bubble ${
            isUser 
              ? 'chat-bubble-user' 
              : 'chat-bubble-bot'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {/* 普通消息内容 */}
          {message.content && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}
          
          {/* 服务按钮 */}
          {!isUser && renderServiceButtons(message.metadata)}
          
          {/* 快速回答选项 */}
          {!isUser && renderQuickReplyMessage(message, onQuickReplySelect)}
          
          {/* 游戏卡片 */}
          {!isUser && message.isGameCard && (
            <div className="mt-3">
              <GameCard onPlay={() => console.log('游戏开始')} />
            </div>
          )}
          
          <div className={`text-xs ${message.content || message.isGameCard ? 'mt-2' : 'mt-0'} ${
            isUser ? 'text-primary-100' : 'text-gray-400'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </motion.div>

        {/* 风险等级指示器 (仅显示在Bot消息上) */}
        {!isUser && message.metadata?.riskLevel && (
          <motion.div 
            className={`inline-flex items-center space-x-1 mt-1 ml-1 px-2 py-1 rounded-full text-xs ${
              message.metadata.riskLevel === 'high' || message.metadata.riskLevel === 'critical'
                ? 'bg-red-100 text-red-700'
                : message.metadata.riskLevel === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>
              {message.metadata.riskLevel === 'critical' && '紧急关注'}
              {message.metadata.riskLevel === 'high' && '高风险'}
              {message.metadata.riskLevel === 'medium' && '中等风险'}
              {message.metadata.riskLevel === 'low' && '低风险'}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default MessageBubble