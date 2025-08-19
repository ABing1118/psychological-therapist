const express = require('express')
const router = express.Router()

// 获取统计数据
router.get('/stats', async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query
    
    // 模拟统计数据
    const stats = {
      totalSessions: 127,
      activeSessions: 8,
      completedSessions: 115,
      escalatedSessions: 4,
      riskLevelDistribution: {
        unknown: 23,
        low: 67,
        medium: 28,
        high: 7,
        critical: 2
      },
      averageSessionDuration: 18.5, // 分钟
      averageMessagesPerSession: 15.3,
      emergencyInterventions: 12,
      successfulInterventions: 9,
      timeRange,
      lastUpdated: new Date()
    }
    
    res.json(stats)
    
  } catch (error) {
    console.error('❌ 获取统计数据错误:', error)
    res.status(500).json({
      error: '获取统计数据失败'
    })
  }
})

// 获取风险趋势数据
router.get('/risk-trends', async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query
    
    // 模拟风险趋势数据
    const trends = {
      timeRange,
      dataPoints: [
        { date: '2024-01-15', high: 2, critical: 0, medium: 5, low: 8 },
        { date: '2024-01-16', high: 3, critical: 1, medium: 7, low: 12 },
        { date: '2024-01-17', high: 1, critical: 0, medium: 4, low: 15 },
        { date: '2024-01-18', high: 4, critical: 2, medium: 8, low: 18 },
        { date: '2024-01-19', high: 2, critical: 1, medium: 6, low: 14 },
        { date: '2024-01-20', high: 3, critical: 0, medium: 9, low: 16 },
        { date: '2024-01-21', high: 1, critical: 1, medium: 5, low: 11 }
      ],
      totalHighRisk: 16,
      totalCritical: 5,
      trend: 'stable' // increasing, decreasing, stable
    }
    
    res.json(trends)
    
  } catch (error) {
    console.error('❌ 获取风险趋势错误:', error)
    res.status(500).json({
      error: '获取风险趋势失败'
    })
  }
})

// 获取关键词分析
router.get('/keywords', async (req, res) => {
  try {
    const { timeRange = '7d', minFrequency = 3 } = req.query
    
    // 模拟关键词分析数据
    const keywords = {
      timeRange,
      riskKeywords: [
        { word: '自杀', frequency: 8, riskScore: 0.95, trend: 'increasing' },
        { word: '死', frequency: 12, riskScore: 0.87, trend: 'stable' },
        { word: '结束', frequency: 15, riskScore: 0.72, trend: 'decreasing' },
        { word: '没意义', frequency: 6, riskScore: 0.68, trend: 'stable' },
        { word: '绝望', frequency: 9, riskScore: 0.81, trend: 'increasing' }
      ],
      emotionKeywords: [
        { word: '抑郁', frequency: 23, emotion: 'sadness', severity: 0.78 },
        { word: '焦虑', frequency: 31, emotion: 'anxiety', severity: 0.65 },
        { word: '压力', frequency: 42, emotion: 'stress', severity: 0.58 },
        { word: '痛苦', frequency: 18, emotion: 'pain', severity: 0.82 },
        { word: '孤独', frequency: 26, emotion: 'loneliness', severity: 0.71 }
      ],
      totalKeywords: 185,
      newKeywords: ['迷茫', '疲惫', '无助']
    }
    
    res.json(keywords)
    
  } catch (error) {
    console.error('❌ 获取关键词分析错误:', error)
    res.status(500).json({
      error: '获取关键词分析失败'
    })
  }
})

// 获取干预效果分析
router.get('/interventions', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query
    
    // 模拟干预效果数据
    const interventions = {
      timeRange,
      totalInterventions: 47,
      successfulInterventions: 38,
      successRate: 0.81,
      interventionTypes: [
        {
          type: 'emergency_hotline',
          name: '紧急热线',
          count: 15,
          successRate: 0.87,
          averageResponseTime: '2.3m'
        },
        {
          type: 'professional_referral',
          name: '专业转介',
          count: 12,
          successRate: 0.92,
          averageResponseTime: '8.7m'
        },
        {
          type: 'crisis_chat',
          name: '危机对话',
          count: 20,
          successRate: 0.75,
          averageResponseTime: '1.8m'
        }
      ],
      outcomes: [
        { outcome: 'immediate_safety', count: 28, percentage: 0.60 },
        { outcome: 'professional_help', count: 15, percentage: 0.32 },
        { outcome: 'ongoing_support', count: 10, percentage: 0.21 },
        { outcome: 'family_notification', count: 6, percentage: 0.13 }
      ]
    }
    
    res.json(interventions)
    
  } catch (error) {
    console.error('❌ 获取干预分析错误:', error)
    res.status(500).json({
      error: '获取干预分析失败'
    })
  }
})

// 获取实时警报
router.get('/alerts', async (req, res) => {
  try {
    const { active = true } = req.query
    
    // 模拟实时警报数据
    const alerts = [
      {
        id: 'alert_001',
        type: 'high_risk_user',
        severity: 'critical',
        sessionId: 'session_003',
        message: '用户表达了明确的自杀意图',
        timestamp: new Date(Date.now() - 5 * 60000),
        status: 'active',
        assignedTo: null
      },
      {
        id: 'alert_002',
        type: 'multiple_risk_keywords',
        severity: 'high',
        sessionId: 'session_007',
        message: '检测到多个高风险关键词',
        timestamp: new Date(Date.now() - 12 * 60000),
        status: 'acknowledged',
        assignedTo: 'counselor_001'
      },
      {
        id: 'alert_003',
        type: 'system_performance',
        severity: 'medium',
        message: 'AI响应时间超过阈值',
        timestamp: new Date(Date.now() - 20 * 60000),
        status: 'resolved',
        assignedTo: 'tech_team'
      }
    ]
    
    const filteredAlerts = active 
      ? alerts.filter(alert => alert.status === 'active')
      : alerts
    
    res.json({
      alerts: filteredAlerts,
      total: filteredAlerts.length,
      activeCount: alerts.filter(a => a.status === 'active').length
    })
    
  } catch (error) {
    console.error('❌ 获取警报错误:', error)
    res.status(500).json({
      error: '获取警报失败'
    })
  }
})

// 导出数据
router.get('/export', async (req, res) => {
  try {
    const { type = 'sessions', format = 'json', timeRange = '30d' } = req.query
    
    // 模拟导出数据
    const exportData = {
      type,
      format,
      timeRange,
      generatedAt: new Date(),
      dataCount: 0,
      downloadUrl: `/api/analytics/download/${type}_${Date.now()}.${format}`
    }
    
    if (type === 'sessions') {
      exportData.dataCount = 127
    } else if (type === 'messages') {
      exportData.dataCount = 1945
    }
    
    console.log(`📤 导出请求: ${type} (${format}) - ${timeRange}`)
    
    res.json(exportData)
    
  } catch (error) {
    console.error('❌ 导出数据错误:', error)
    res.status(500).json({
      error: '导出数据失败'
    })
  }
})

module.exports = router