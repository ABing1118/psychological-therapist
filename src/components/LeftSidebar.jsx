import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ClipboardList, GamepadIcon, User, MapPin, Heart, ChevronRight, ChevronLeft } from 'lucide-react'

const LeftSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeService, setActiveService] = useState(null)

  const services = [
    {
      id: 'emergency',
      title: '紧急热线',
      description: '24小时危机干预热线',
      icon: <Phone className="w-5 h-5" />,
      urgent: true,
      action: '立即拨打',
      onClick: () => {
        window.open('tel:400-161-9995')
      }
    },
    {
      id: 'assessment',
      title: '心理测评',
      description: 'PHQ-9抑郁症量表',
      icon: <ClipboardList className="w-5 h-5" />,
      action: '开始测评',
      onClick: () => {
        console.log('开始心理测评')
      }
    },
    {
      id: 'games',
      title: '放松游戏',
      description: '冥想|导呼吸练习',
      icon: <GamepadIcon className="w-5 h-5" />,
      action: '开始放松',
      onClick: () => {
        console.log('开始放松游戏')
      }
    },
    {
      id: 'counseling',
      title: '专业咨询',
      description: '预约专业心理咨询师',
      icon: <User className="w-5 h-5" />,
      action: '立即预约',
      onClick: () => {
        console.log('预约专业咨询')
      }
    },
    {
      id: 'nearby',
      title: '附近机构',
      description: '查找附近的心理健康机构',
      icon: <MapPin className="w-5 h-5" />,
      action: '查看位置',
      onClick: () => {
        console.log('查看附近机构')
      }
    },
    {
      id: 'support',
      title: '情感支持',
      description: '同伴支持社群资源',
      icon: <Heart className="w-5 h-5" />,
      action: '加入社群',
      onClick: () => {
        console.log('加入支持社群')
      }
    }
  ]

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    setActiveService(null)
  }

  return (
    <div className="h-full flex">
      {/* 图标栏 - 始终显示 */}
      <div className="w-16 bg-white/20 backdrop-blur-md border-r border-white/20 flex flex-col">
        {/* 展开/收缩按钮 */}
        <motion.button
          onClick={toggleExpanded}
          className="h-12 flex items-center justify-center hover:bg-white/20 transition-colors border-b border-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5 text-blue-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-blue-500" />
          )}
        </motion.button>

        {/* 服务图标 */}
        <div className="flex-1 py-2">
          {services.map((service) => (
            <motion.button
              key={service.id}
              onClick={() => {
                if (isExpanded) {
                  setActiveService(activeService === service.id ? null : service.id)
                } else {
                  service.onClick()
                }
              }}
              className={`w-full h-12 flex items-center justify-center hover:bg-white/20 transition-colors relative ${
                activeService === service.id ? 'bg-white/30' : ''
              } ${service.urgent ? 'hover:bg-red-100/30' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={!isExpanded ? service.title : undefined}
            >
              <div className={`${
                service.urgent ? 'text-red-600' : 'text-blue-500'
              }`}>
                {service.icon}
              </div>
              {service.urgent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 展开的服务面板 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="w-80 bg-white/30 backdrop-blur-md border-r border-white/20 flex flex-col shadow-lg"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* 头部 */}
            <div className="p-4 border-b border-white/20">
              <h2 className="font-semibold text-gray-900">支持服务</h2>
              <p className="text-sm text-gray-700">获取专业帮助和资源</p>
            </div>

            {/* 服务列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    service.urgent
                      ? 'bg-red-50 border-red-200 hover:bg-red-100'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  } ${activeService === service.id ? 'ring-2 ring-blue-300' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={service.onClick}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      service.urgent
                        ? 'bg-red-500 text-white'
                        : 'bg-primary-100 text-primary-600'
                    }`}>
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${
                        service.urgent ? 'text-red-800' : 'text-gray-900'
                      }`}>
                        {service.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        service.urgent ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        {service.description}
                      </p>
                      <motion.button
                        className={`mt-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          service.urgent
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          service.onClick()
                        }}
                      >
                        {service.action}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LeftSidebar