import React from 'react'
import { motion } from 'framer-motion'
import { Heart, ExternalLink } from 'lucide-react'

const MusicCard = ({ message }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 预设的音乐数据，包含真实的外链地址
  const musicLibrary = {
    'piano-night-5': {
      title: '夜的钢琴曲五',
      artist: '石进',
      duration: '4:32',
      cover: 'http://p2.music.126.net/BUGjlj2O8qY0mmHmVuer6Q==/109951168892676402.jpg?param=130y130',
      platform: 'netease',
      platformColor: '#C20C0C',
      platformName: '网易云音乐',
      url: 'https://music.163.com/#/song?id=149297'
    },
    'piano-night-1': {
      title: '夜的钢琴曲一',
      artist: '石进',
      duration: '1:29',
      cover: 'http://p2.music.126.net/BUGjlj2O8qY0mmHmVuer6Q==/109951168892676402.jpg?param=130y130',
      platform: 'netease',
      platformColor: '#C20C0C',
      platformName: '网易云音乐',
      url: 'https://music.163.com/#/song?id=149285'
    },
  }

  // 根据消息内容选择音乐
  const getMusicData = () => {
    if (message.musicType === 'meditation') {
      return musicLibrary['piano-night-1']  // 使用存在的键
    } else if (message.musicType === 'relaxing') {
      return musicLibrary['piano-night-5']  // 使用存在的键
    }
    return musicLibrary['piano-night-5']    // 默认返回存在的键
  }

  const currentMusic = getMusicData()

  // 处理点击跳转
  const handleCardClick = () => {
    window.open(currentMusic.url, '_blank')
  }

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
      <div className="max-w-sm lg:max-w-md w-full">
        {/* AI头像 */}
        <div className="flex items-center space-x-2 mb-2 ml-1">
          <div className="w-7 h-7 bg-gradient-to-r from-primary-500 to-warm-500 rounded-full flex items-center justify-center shadow-md">
            <Heart className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs text-gray-600 font-medium">心理健康助手</span>
        </div>

        {/* 音乐卡片容器 - 整个卡片可点击 */}
        <motion.div
          onClick={handleCardClick}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-warm-200/50 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {/* 音乐信息区域 */}
          <div className="flex items-center space-x-4">
            {/* 左侧头像/封面 */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                <img
                  src={currentMusic.cover}
                  alt={currentMusic.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 封面加载失败时使用默认图片
                    e.target.src = '/character/general.png'
                  }}
                />
              </div>
            </div>

            {/* 中间歌曲信息 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-800 truncate">
                {currentMusic.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {currentMusic.artist}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs text-gray-400">{currentMusic.duration}</span>
              </div>
            </div>

            {/* 右侧专辑封面 */}
            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md">
              <img
                src={currentMusic.cover}
                alt={`${currentMusic.title} 专辑封面`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/character/general.png'
                }}
              />
            </div>
          </div>

          {/* 音乐平台标识和跳转提示 */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              {/* 平台logo */}
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: currentMusic.platformColor }}
              >
                {currentMusic.platform === 'netease' ? '网' : 'Q'}
              </div>
              <span className="text-xs text-gray-500">{currentMusic.platformName}</span>
              <span className="text-xs text-gray-400">• 点击收听</span>
            </div>

            {/* 跳转图标 */}
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3 h-3 text-gray-400" />
              <div className="text-xs text-gray-400">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default React.memo(MusicCard, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id &&
    prevProps.message.timestamp === nextProps.message.timestamp
})