import React from 'react'
import { motion } from 'framer-motion'

const GameCard = ({ onPlay }) => {
  const handlePlayGame = () => {
    // 在当前浏览器新开tab页
    window.open('/game.html', '_blank')
    if (onPlay) onPlay()
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-4 border border-teal-100 shadow-sm max-w-sm mx-auto cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={handlePlayGame}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 游戏头部信息 */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-400 rounded-xl flex items-center justify-center">
          <span className="text-white text-xl">🍎</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-sm">心灵果园</h3>
          <p className="text-xs text-gray-500">治愈系放松小游戏</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">小程序</div>
        </div>
      </div>

      {/* 游戏预览 */}
      <div className="bg-gradient-to-r from-teal-100 to-green-100 rounded-xl p-4 mb-3 text-center">
        <div className="text-3xl mb-2 animate-pulse">🍎🍊🍇🍓</div>
        <p className="text-xs text-teal-700 leading-relaxed">
          轻松切水果，释放压力<br />
          专注当下，享受宁静时光
        </p>
      </div>

      {/* 游戏标签 */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <span className="inline-block bg-teal-100 text-teal-600 text-xs px-2 py-1 rounded-full">
            🧘‍♀️ 放松
          </span>
          <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
            ⏱ 1-2分钟
          </span>
        </div>
        <div className="text-xs text-gray-400 flex items-center">
          点击进入 →
        </div>
      </div>
    </motion.div>
  )
}

export default GameCard