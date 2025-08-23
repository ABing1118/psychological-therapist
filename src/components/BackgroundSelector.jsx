import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Shuffle, Clock, X } from 'lucide-react'
import { useBackground } from '../contexts/BackgroundContext'

const BackgroundSelector = ({ isOpen, onClose }) => {
  const { 
    currentBackground, 
    backgroundImages, 
    changeBackground, 
    randomBackground, 
    useRecommendedBackground 
  } = useBackground()

  const [previewImage, setPreviewImage] = useState(null)

  const handleBackgroundSelect = (background) => {
    changeBackground(background.id)
    // 添加一个短暂的预览效果
    setPreviewImage(background.path)
    setTimeout(() => setPreviewImage(null), 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* 背景选择面板 */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl">
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  <Image className="w-6 h-6 text-primary-500" />
                  背景选择
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  选择一个让你感到舒适的背景环境
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 快速操作按钮 */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex gap-3">
                <motion.button
                  onClick={randomBackground}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shuffle className="w-4 h-4" />
                  随机背景
                </motion.button>
                
                <motion.button
                  onClick={useRecommendedBackground}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-lg hover:from-warm-600 hover:to-warm-700 transition-all shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Clock className="w-4 h-4" />
                  智能推荐
                </motion.button>
              </div>
            </div>

            {/* 背景网格 */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {backgroundImages.map((background) => (
                  <motion.div
                    key={background.id}
                    className={`relative group cursor-pointer rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                      currentBackground.id === background.id 
                        ? 'border-primary-500 ring-2 ring-primary-200' 
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleBackgroundSelect(background)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* 背景图片预览 */}
                    <img
                      src={background.path}
                      alt={background.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* 背景信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-medium text-sm mb-1">
                        {background.name}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {background.mood}
                      </p>
                    </div>

                    {/* 选中状态指示器 */}
                    {currentBackground.id === background.id && (
                      <motion.div
                        className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.3 }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}

                    {/* 悬停效果 */}
                    <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 当前背景信息 */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">当前背景</p>
                  <p className="font-medium text-gray-800">{currentBackground.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentBackground.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${{
                    'morning': 'bg-yellow-100 text-yellow-700',
                    'afternoon': 'bg-orange-100 text-orange-700',
                    'night': 'bg-indigo-100 text-indigo-700'
                  }[currentBackground.time]}`}>
                    {currentBackground.time === 'morning' && '🌅 晨间'}
                    {currentBackground.time === 'afternoon' && '🌞 午后'}
                    {currentBackground.time === 'night' && '🌙 夜晚'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </motion.div>

          {/* 预览效果 */}
          {previewImage && (
            <motion.div
              className="fixed inset-0 pointer-events-none z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
            >
              <img
                src={previewImage}
                alt="预览"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

export default BackgroundSelector