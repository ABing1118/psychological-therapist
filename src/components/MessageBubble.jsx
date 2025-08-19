import React from 'react'
import { motion } from 'framer-motion'
import { Heart, AlertTriangle, Phone } from 'lucide-react'

const MessageBubble = ({ message }) => {
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
          <div className="flex items-center space-x-2 mb-1 ml-1">
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-500">心理健康助手</span>
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
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {!isUser && renderServiceButtons(message.metadata)}
          
          <div className={`text-xs mt-2 ${
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