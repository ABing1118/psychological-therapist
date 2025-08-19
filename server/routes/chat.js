const express = require('express')
const router = express.Router()
const agentService = require('../services/agentService')
const riskAssessment = require('../services/riskAssessment')
const { v4: uuidv4 } = require('uuid')

// 发送消息接口
router.post('/', async (req, res) => {
  try {
    const { message, sessionId, riskLevel, userInfo } = req.body
    
    if (!message || !sessionId) {
      return res.status(400).json({
        error: '消息内容和会话ID不能为空'
      })
    }
    
    console.log(`💬 [${sessionId}] 用户: ${message}`)
    
    // 生成AI回复
    const agentResponse = await agentService.generateResponse({
      message,
      sessionId,
      userInfo,
      riskLevel
    })
    
    // 风险评估
    const riskResult = await riskAssessment.assessMessage({
      message,
      previousRiskLevel: riskLevel,
      userInfo
    })
    
    const response = {
      message: agentResponse.content,
      riskLevel: riskResult.level,
      userInfo: {
        ...userInfo,
        conversationDepth: (userInfo?.conversationDepth || 0) + 1,
        hasSharedEmotions: agentResponse.metadata?.emotionDetected || userInfo?.hasSharedEmotions,
        hasExpressedSuicidalThoughts: riskResult.suicidalIndicators.length > 0
      },
      metadata: {
        riskLevel: riskResult.level,
        suggestedServices: agentResponse.suggestedServices,
        emotionDetected: agentResponse.metadata?.emotionDetected,
        keywordsDetected: riskResult.keywordsDetected,
        confidence: riskResult.confidence
      }
    }
    
    console.log(`🤖 [${sessionId}] 助手: ${agentResponse.content.substring(0, 50)}...`)
    console.log(`📊 [${sessionId}] 风险评估: ${riskResult.level} (${riskResult.confidence}%)`)
    
    res.json(response)
    
  } catch (error) {
    console.error('❌ 聊天处理错误:', error)
    res.status(500).json({
      message: '抱歉，我现在遇到了一些技术问题。如果你正处于紧急情况，请立即拨打危机热线：400-161-9995',
      riskLevel: 'unknown',
      error: true
    })
  }
})

// 获取会话历史
router.get('/:sessionId/history', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { limit = 50 } = req.query
    
    // 这里应该从数据库获取会话历史
    // 暂时返回模拟数据
    const mockHistory = [
      {
        id: uuidv4(),
        type: 'bot',
        content: '你好，我很高兴你愿意和我聊聊。我是来倾听的，如果你愿意，可以告诉我今天你的感受如何？',
        timestamp: new Date(Date.now() - 300000),
        riskLevel: 'unknown'
      }
    ]
    
    res.json({
      sessionId,
      messages: mockHistory,
      total: mockHistory.length
    })
    
  } catch (error) {
    console.error('❌ 获取会话历史错误:', error)
    res.status(500).json({
      error: '获取会话历史失败'
    })
  }
})

// 清除会话
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    
    // 这里应该从数据库删除会话数据
    console.log(`🗑️  清除会话: ${sessionId}`)
    
    res.json({
      message: '会话已清除',
      sessionId
    })
    
  } catch (error) {
    console.error('❌ 清除会话错误:', error)
    res.status(500).json({
      error: '清除会话失败'
    })
  }
})

module.exports = router