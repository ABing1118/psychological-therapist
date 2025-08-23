import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QuickReplyOptions = ({ question, options, onSelect, visible }) => {
  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-20 left-4 right-4 z-40"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-lg mx-auto">
          {/* AI助手头像和问题 */}
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-primary-50 to-warm-50">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-warm-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-medium">AI</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 mb-1">心理健康助手</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {question}
              </p>
            </div>
          </div>
          
          {/* 快速选项 */}
          <div className="p-4 space-y-3">
            {options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => onSelect(option.value, option.label)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-gray-700">{option.label}</span>
              </motion.button>
            ))}
          </div>
          
          {/* 底部提示 */}
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-500 text-center">
              点击选项快速回答，或在下方输入框自由表达
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QuickReplyOptions