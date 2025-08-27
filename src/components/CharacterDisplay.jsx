import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCharacter } from '../contexts/CharacterContext'

const CharacterDisplay = () => {
  const { getCurrentStateInfo } = useCharacter()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const stateInfo = getCurrentStateInfo()

  // 图片加载处理
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  // 重置图片加载状态当状态改变时
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [stateInfo.state])

  // 检查图片是否已经加载（针对缓存图片的修复）
  useEffect(() => {
    const img = document.querySelector(`img[alt="${stateInfo.name}"]`)
    if (img && img.complete && img.naturalWidth > 0) {
      // 图片已经在缓存中加载完成
      setImageLoaded(true)
      setImageError(false)
    }
  }, [stateInfo.state, stateInfo.name])


  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* 人物图片区域 - 充满整个左侧 */}
      <div className="flex-1 relative flex items-end justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={stateInfo.state}
            className="relative w-full h-full flex items-end justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              duration: 0.6 
            }}
          >
            {/* 人物图片 - 无背景框，直接显示，保持底部对齐 */}
            <div className="relative w-full h-full flex items-end justify-center px-4 pb-4 pt-6 overflow-hidden">
              {!imageError ? (
                <>
                  <img
                    src={stateInfo.image}
                    alt={stateInfo.name}
                    className={`w-auto h-[100%] max-w-full object-contain transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  
                  {/* 加载中占位符 */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                    </div>
                  )}
                </>
              ) : (
                /* 错误占位符 */
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="text-sm text-center">
                    <p>图片加载失败</p>
                    <p className="text-xs opacity-70">{stateInfo.state}</p>
                  </div>
                </div>
              )}

              {/* 悬停效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>


    </div>
  )
}

export default CharacterDisplay