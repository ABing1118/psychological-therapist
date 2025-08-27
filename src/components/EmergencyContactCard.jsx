import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Heart, AlertTriangle, Clock, X } from 'lucide-react'

const EmergencyContactCard = ({ visible, onClose, emergencyType = 'crisis' }) => {
  const emergencyContacts = {
    crisis: {
      title: '心理危机干预热线',
      subtitle: '24小时免费心理支持服务',
      phone: '400-161-9995',
      description: '专业心理咨询师将为您提供即时帮助',
      color: 'red',
      icon: AlertTriangle
    },
    counseling: {
      title: '心理咨询热线', 
      subtitle: '专业心理健康咨询',
      phone: '400-123-4567',
      description: '预约专业心理咨询师进行深度交流',
      color: 'blue',
      icon: Heart
    }
  }

  const contact = emergencyContacts[emergencyType] || emergencyContacts.crisis
  const Icon = contact.icon

  const handleCall = () => {
    // 在移动端尝试直接拨打电话
    if (navigator.userAgent.match(/Mobile|Android|iPhone/i)) {
      window.location.href = `tel:${contact.phone}`
    } else {
      // 桌面端复制电话号码到剪贴板
      navigator.clipboard.writeText(contact.phone).then(() => {
        alert(`电话号码已复制到剪贴板: ${contact.phone}`)
      }).catch(() => {
        alert(`请拨打: ${contact.phone}`)
      })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-0 lg:left-[15%] top-20 z-50 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.5
          }}
        >
          {/* 气泡容器 */}
          <div className="relative max-w-sm mx-4 pointer-events-auto">
            {/* 主气泡 */}
            <div className="relative bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200/60 rounded-2xl shadow-2xl overflow-hidden">
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-sm z-10"
              >
                <X size={14} className="text-gray-500" />
              </button>

              {/* 内容区域 */}
              <div className="p-4 space-y-3">
                {/* 头部图标和标题 */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-800 truncate">
                      {contact.title}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {contact.subtitle}
                    </p>
                  </div>
                </div>

                {/* 电话号码 */}
                <div className="bg-white/60 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-red-600 mb-1 tracking-wide">
                    {contact.phone}
                  </div>
                  <p className="text-xs text-gray-600 leading-tight">
                    {contact.description}
                  </p>
                </div>

                {/* 服务时间 */}
                <div className="flex items-center justify-center bg-red-100/50 rounded-lg p-2">
                  <Clock size={12} className="text-red-500 mr-1.5" />
                  <span className="text-xs text-red-700">24小时全天候服务</span>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-2">
                  <button
                    onClick={handleCall}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm"
                  >
                    <Phone size={16} />
                    <span>立即拨打</span>
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                  >
                    稍后联系
                  </button>
                </div>

                {/* 温馨提示 */}
                <div className="bg-yellow-50/80 border border-yellow-200/60 rounded-lg p-2">
                  <div className="flex items-start">
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-700 ml-2 leading-tight">
                      紧急危险时请立即拨打110或120
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 气泡尖角 */}
            <div className="absolute -bottom-2 left-8">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-red-200/60"></div>
              <div className="absolute -top-0.5 left-0.5 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[11px] border-t-red-50"></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EmergencyContactCard