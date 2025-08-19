import React from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Phone, 
  Heart, 
  GamepadIcon, 
  ClipboardList, 
  MapPin, 
  User,
  Shield
} from 'lucide-react'

const ServicePanel = ({ onClose }) => {
  const services = [
    {
      id: 'emergency',
      icon: <Phone className="w-5 h-5" />,
      title: '紧急热线',
      description: '24小时危机干预热线',
      action: '立即拨打',
      urgent: true,
      onClick: () => {
        window.open('tel:400-161-9995')
      }
    },
    {
      id: 'assessment',
      icon: <ClipboardList className="w-5 h-5" />,
      title: '心理测评',
      description: 'PHQ-9抑郁症筛查量表',
      action: '开始测评',
      onClick: () => {
        console.log('打开心理测评')
      }
    },
    {
      id: 'games',
      icon: <GamepadIcon className="w-5 h-5" />,
      title: '放松游戏',
      description: '冥想引导和呼吸练习',
      action: '开始放松',
      onClick: () => {
        console.log('打开放松游戏')
      }
    },
    {
      id: 'counseling',
      icon: <User className="w-5 h-5" />,
      title: '专业咨询',
      description: '预约专业心理咨询师',
      action: '立即预约',
      onClick: () => {
        console.log('预约专业咨询')
      }
    },
    {
      id: 'location',
      icon: <MapPin className="w-5 h-5" />,
      title: '附近机构',
      description: '查找附近的心理健康机构',
      action: '查看位置',
      onClick: () => {
        console.log('查看附近机构')
      }
    },
    {
      id: 'support',
      icon: <Heart className="w-5 h-5" />,
      title: '情感支持',
      description: '同伴支持社群和资源',
      action: '加入社群',
      onClick: () => {
        console.log('加入支持社群')
      }
    }
  ]

  return (
    <motion.div
      className="w-80 glass-effect border-l border-white/20 flex flex-col"
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      {/* 头部 */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">支持服务</h2>
          <p className="text-sm text-gray-500">获取专业帮助和资源</p>
        </div>
        <motion.button
          onClick={onClose}
          className="p-2 hover:bg-white/50 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4 text-gray-500" />
        </motion.button>
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
            }`}
            initial={{ opacity: 0, x: 20 }}
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
                  service.urgent ? 'text-red-800' : 'text-gray-800'
                }`}>
                  {service.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  service.urgent ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {service.description}
                </p>
                <motion.button
                  className={`mt-2 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    service.urgent
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {service.action}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 底部安全提示 */}
      <motion.div 
        className="p-4 bg-primary-50 border-t border-primary-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-800">隐私保护</span>
        </div>
        <p className="text-xs text-primary-700">
          所有对话都经过加密处理，我们严格保护你的隐私。如果遇到紧急情况，请立即拨打热线电话。
        </p>
      </motion.div>
    </motion.div>
  )
}

export default ServicePanel