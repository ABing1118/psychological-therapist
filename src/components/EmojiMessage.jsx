import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import styles from './EmojiMessage.module.css'

const EmojiMessage = ({ message }) => {
  const imgRef = React.useRef(null)

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // 简单的GIF动画确保
  React.useEffect(() => {
    if (imgRef.current && message.emoji) {
      const img = imgRef.current
      img.style.animationPlayState = 'running'
    }
  }, [message.emoji])

  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <div className="max-w-xs lg:max-w-md">
        {/* AI头像 */}
        <div className="flex items-center space-x-2 mb-2 ml-1">
          <div className="w-7 h-7 bg-gradient-to-r from-primary-500 to-warm-500 rounded-full flex items-center justify-center shadow-md">
            <Heart className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs text-gray-600 font-medium">心理健康助手</span>
        </div>
        
        {/* 表情包容器 */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-warm-200/50 flex flex-col items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {/* GIF表情包 */}
          <div className={`mb-2 ${styles.emojiContainer}`}>
            <img 
              ref={imgRef}
              src={message.emoji}
              alt="表情包" 
              className={`w-40 h-40 object-contain rounded-lg ${styles.emojiImage}`}
              style={{ 
                imageRendering: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
              onLoad={() => {
                // GIF加载完成
                if (imgRef.current) {
                  imgRef.current.style.animationPlayState = 'running'
                }
              }}
              onError={(e) => {
                console.error('Emoji image failed to load:', message.emoji, e)
                // 简单隐藏失败的图片
                e.target.style.display = 'none'
                const container = e.target.closest('div[class*="mb-4"]')
                if (container) container.style.display = 'none'
              }}
            />
          </div>
          
          {/* 时间戳 */}
          <div className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 使用React.memo优化组件，防止不必要的重渲染
export default React.memo(EmojiMessage, (prevProps, nextProps) => {
  // 只有当emoji路径改变时才重新渲染
  return prevProps.message.emoji === nextProps.message.emoji && 
         prevProps.message.timestamp === nextProps.message.timestamp
})