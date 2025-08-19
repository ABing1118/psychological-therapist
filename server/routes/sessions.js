const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')

// 创建新会话
router.post('/', async (req, res) => {
  try {
    const sessionId = uuidv4()
    const session = {
      id: sessionId,
      startTime: new Date(),
      status: 'active',
      riskLevel: 'unknown',
      messageCount: 0,
      userInfo: {
        hasSharedEmotions: false,
        hasExpressedSuicidalThoughts: false,
        conversationDepth: 0
      }
    }
    
    console.log(`🆕 创建新会话: ${sessionId}`)
    
    res.json({
      sessionId,
      session
    })
    
  } catch (error) {
    console.error('❌ 创建会话错误:', error)
    res.status(500).json({
      error: '创建会话失败'
    })
  }
})

// 获取会话信息
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    
    // 模拟会话数据
    const session = {
      id: sessionId,
      startTime: new Date(Date.now() - 30 * 60000),
      status: 'active',
      riskLevel: 'medium',
      messageCount: 12,
      lastActivity: new Date(),
      userInfo: {
        hasSharedEmotions: true,
        hasExpressedSuicidalThoughts: false,
        conversationDepth: 6
      },
      metadata: {
        keywordsDetected: ['压力', '焦虑', '工作'],
        emotionsDetected: ['sadness', 'anxiety'],
        interventionsTriggered: []
      }
    }
    
    res.json(session)
    
  } catch (error) {
    console.error('❌ 获取会话信息错误:', error)
    res.status(500).json({
      error: '获取会话信息失败'
    })
  }
})

// 更新会话状态
router.patch('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const updates = req.body
    
    console.log(`📝 更新会话 ${sessionId}:`, updates)
    
    // 这里应该更新数据库中的会话信息
    const updatedSession = {
      id: sessionId,
      ...updates,
      lastUpdated: new Date()
    }
    
    res.json(updatedSession)
    
  } catch (error) {
    console.error('❌ 更新会话错误:', error)
    res.status(500).json({
      error: '更新会话失败'
    })
  }
})

// 获取活跃会话列表
router.get('/', async (req, res) => {
  try {
    const { status = 'active', limit = 20, offset = 0 } = req.query
    
    // 模拟活跃会话数据
    const sessions = [
      {
        id: 'session_001',
        startTime: new Date(Date.now() - 15 * 60000),
        status: 'active',
        riskLevel: 'high',
        messageCount: 24,
        lastActivity: new Date(Date.now() - 2 * 60000),
        lastMessage: '我觉得生活真的没有意义了...'
      },
      {
        id: 'session_002',
        startTime: new Date(Date.now() - 45 * 60000),
        status: 'completed',
        riskLevel: 'medium',
        messageCount: 12,
        lastActivity: new Date(Date.now() - 10 * 60000),
        lastMessage: '谢谢你的倾听，我感觉好一些了'
      },
      {
        id: 'session_003',
        startTime: new Date(Date.now() - 2 * 60 * 60000),
        status: 'escalated',
        riskLevel: 'critical',
        messageCount: 8,
        lastActivity: new Date(Date.now() - 60 * 60000),
        lastMessage: '我已经准备好了...'
      }
    ]
    
    const filteredSessions = sessions.filter(s => 
      status === 'all' || s.status === status
    ).slice(offset, offset + limit)
    
    res.json({
      sessions: filteredSessions,
      total: sessions.length,
      hasMore: offset + limit < sessions.length
    })
    
  } catch (error) {
    console.error('❌ 获取会话列表错误:', error)
    res.status(500).json({
      error: '获取会话列表失败'
    })
  }
})

// 结束会话
router.post('/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { reason = 'user_ended' } = req.body
    
    console.log(`🔚 结束会话: ${sessionId} (原因: ${reason})`)
    
    // 这里应该更新数据库，标记会话为结束状态
    const endedSession = {
      id: sessionId,
      status: 'completed',
      endTime: new Date(),
      endReason: reason
    }
    
    res.json({
      message: '会话已结束',
      session: endedSession
    })
    
  } catch (error) {
    console.error('❌ 结束会话错误:', error)
    res.status(500).json({
      error: '结束会话失败'
    })
  }
})

module.exports = router