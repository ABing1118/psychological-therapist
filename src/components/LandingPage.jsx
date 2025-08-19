import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Shield, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const LandingPage = () => {
  const [isEntering, setIsEntering] = useState(false)
  const navigate = useNavigate()

  const handleStartChat = () => {
    setIsEntering(true)
    setTimeout(() => {
      navigate('/chat')
    }, 1000)
  }

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "温暖陪伴",
      description: "24小时温和倾听，理解你的感受"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "安全保护",
      description: "专业的风险评估和及时干预"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "智能对话",
      description: "自然的对话体验，循序渐进的引导"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "专业支持",
      description: "连接专业心理咨询师和紧急热线"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-primary-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-warm-100/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        className="relative z-10 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 主标题区域 */}
        <div className="mb-12">
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-6 floating-animation"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            你不是一个人
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            我是你的AI心理健康助手，随时准备倾听你的故事。<br />
            无论你现在感受如何，这里都是安全的空间。
          </p>
        </div>

        {/* 特性展示 */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-effect rounded-2xl p-6 floating-card"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4 mx-auto text-primary-600">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 开始对话按钮 */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={handleStartChat}
            disabled={isEntering}
            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg pulse-glow disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {isEntering ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                正在准备...
              </span>
            ) : (
              "开始聊天"
            )}
          </motion.button>
          
          <p className="text-sm text-gray-500">
            点击开始，我们来聊聊吧 ♡
          </p>
        </motion.div>

        {/* 紧急提示 */}
        <motion.div 
          className="mt-16 p-6 bg-red-50 border border-red-100 rounded-2xl max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mb-3 mx-auto">
            <Shield className="w-4 h-4 text-red-600" />
          </div>
          <h4 className="font-semibold text-red-800 mb-2">紧急情况</h4>
          <p className="text-sm text-red-700 mb-3">
            如果你正处于危险中，请立即联系：
          </p>
          <div className="space-y-1 text-sm">
            <p className="font-mono text-red-800">中国：400-161-9995</p>
            <p className="font-mono text-red-800">香港：852-2389-2222</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LandingPage