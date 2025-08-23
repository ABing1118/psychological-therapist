import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GameRecommendationCard = ({ visible, onAccept, onDecline }) => {
  const handlePlayGame = () => {
    // 打开新标签页进入游戏
    window.open('/game.html', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
    onAccept()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* 游戏预览图 */}
            <div className="bg-gradient-to-br from-teal-100 to-green-100 p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-200/30 to-green-200/30"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4 animate-bounce">🍎🍊🍇</div>
                <h3 className="text-2xl font-bold text-teal-800 mb-2">心灵果园</h3>
                <p className="text-teal-600 text-sm">治愈系切水果小游戏</p>
              </div>
              
              {/* 装饰性元素 */}
              <div className="absolute top-4 right-4 text-2xl opacity-60 animate-pulse">🌿</div>
              <div className="absolute bottom-4 left-4 text-xl opacity-60 animate-pulse delay-75">🌸</div>
            </div>
            
            {/* 卡片内容 */}
            <div className="p-6">
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  检测到你的心理状态不错 😊
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  想要通过一个轻松的小游戏来进一步放松心情吗？这个治愈系的切水果游戏可以帮助你：
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex flex-col items-center p-3 bg-teal-50 rounded-xl">
                    <div className="text-2xl mb-1">🧘‍♀️</div>
                    <div className="text-xs text-teal-700 font-medium">专注当下</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-xl">
                    <div className="text-2xl mb-1">😌</div>
                    <div className="text-xs text-green-700 font-medium">释放压力</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-2xl mb-1">💚</div>
                    <div className="text-xs text-blue-700 font-medium">愉悦心情</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs text-purple-700 font-medium">提升活力</div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  游戏时间约 1-2 分钟，不会影响我们的对话
                </p>
              </div>
              
              {/* 按钮组 */}
              <div className="flex gap-3">
                <motion.button
                  onClick={onDecline}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-2xl font-medium text-sm transition-all duration-200 hover:bg-gray-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  暂时不玩
                </motion.button>
                <motion.button
                  onClick={handlePlayGame}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-2xl font-medium text-sm shadow-lg transition-all duration-200 hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  开始游戏 🎮
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameRecommendationCard