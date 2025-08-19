import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const TypingIndicator = () => {
  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-xs lg:max-w-md">
        <div className="flex items-center space-x-2 mb-1 ml-1">
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <Heart className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-gray-500">心理健康助手正在输入...</span>
        </div>
        
        <motion.div
          className="chat-bubble chat-bubble-bot"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          <div className="typing-indicator">
            <motion.div 
              className="typing-dot"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div 
              className="typing-dot"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.div 
              className="typing-dot"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator