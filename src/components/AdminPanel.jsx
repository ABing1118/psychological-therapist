import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  MessageSquare, 
  AlertTriangle,
  BarChart3,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'

const AdminPanel = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalSessions: 127,
    activeSessions: 8,
    highRiskUsers: 3,
    emergencyInterventions: 12
  })
  
  const [recentSessions, setRecentSessions] = useState([
    {
      id: 'session_001',
      timestamp: new Date(Date.now() - 15 * 60000),
      riskLevel: 'high',
      messages: 24,
      status: 'active',
      lastMessage: '我觉得生活真的没有意义了...'
    },
    {
      id: 'session_002', 
      timestamp: new Date(Date.now() - 45 * 60000),
      riskLevel: 'medium',
      messages: 12,
      status: 'completed',
      lastMessage: '谢谢你的倾听，我感觉好一些了'
    },
    {
      id: 'session_003',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      riskLevel: 'critical',
      messages: 8,
      status: 'escalated',
      lastMessage: '我已经准备好了...'
    }
  ])

  const [selectedSession, setSelectedSession] = useState(null)

  const getRiskLevelBadge = (level) => {
    const badges = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return badges[level] || 'bg-gray-100 text-gray-800'
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      escalated: 'bg-red-100 text-red-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const formatTime = (timestamp) => {
    return new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' }).format(
      Math.round((timestamp - new Date()) / 60000),
      'minute'
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <motion.header 
        className="bg-white shadow-sm border-b px-6 py-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">管理面板</h1>
              <p className="text-sm text-gray-600">心理健康AI助手 - 数据监控</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* 统计卡片 */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总会话数</p>
                <p className="text-2xl font-semibold text-gray-800">{stats.totalSessions}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">活跃会话</p>
                <p className="text-2xl font-semibold text-gray-800">{stats.activeSessions}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">高风险用户</p>
                <p className="text-2xl font-semibold text-red-600">{stats.highRiskUsers}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">紧急干预</p>
                <p className="text-2xl font-semibold text-orange-600">{stats.emergencyInterventions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </motion.div>

        {/* 最近会话 */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">最近会话</h2>
              <p className="text-sm text-gray-600">实时监控用户对话状态</p>
            </div>
            
            <div className="divide-y">
              {recentSessions.map((session) => (
                <motion.div
                  key={session.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono text-gray-500">{session.id}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelBadge(session.riskLevel)}`}>
                        {session.riskLevel === 'critical' ? '紧急' : 
                         session.riskLevel === 'high' ? '高风险' :
                         session.riskLevel === 'medium' ? '中风险' : '低风险'}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(session.status)}`}>
                      {session.status === 'active' ? '进行中' :
                       session.status === 'completed' ? '已完成' : '已升级'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {session.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{session.messages} 条消息</span>
                    <span>{formatTime(session.timestamp)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Agent配置和监控 */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Agent 配置</h2>
              <p className="text-sm text-gray-600">AI助手行为设置和监控</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">✓ 系统状态正常</h3>
                <p className="text-sm text-green-700">所有AI模块运行正常，响应时间 &lt; 2秒</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">风险识别敏感度</span>
                  <span className="text-sm text-gray-600">高</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">紧急干预阈值</span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">平均响应时间</span>
                  <span className="text-sm text-gray-600">1.2秒</span>
                </div>
              </div>

              <motion.button 
                className="w-full p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 inline mr-2" />
                导出会话数据
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminPanel