const express = require('express')
const cors = require('cors')
const path = require('path')
const { MongoClient } = require('mongodb')
const Redis = require('redis')
const { v4: uuidv4 } = require('uuid')

const chatRoutes = require('./routes/chat')
const sessionRoutes = require('./routes/sessions')
const analyticsRoutes = require('./routes/analytics')
const agentService = require('./services/agentService')
const riskAssessment = require('./services/riskAssessment')

const app = express()
const PORT = process.env.PORT || 5001

// 中间件配置
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

// 数据库连接
let db
let redisClient

async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/psychological-therapist')
    await client.connect()
    db = client.db()
    console.log('✅ MongoDB 连接成功')
  } catch (error) {
    console.log('⚠️  MongoDB 连接失败 (使用内存存储):', error.message)
    // 继续运行，使用内存存储
  }
}

async function connectRedis() {
  try {
    redisClient = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    })
    await redisClient.connect()
    console.log('✅ Redis 连接成功')
  } catch (error) {
    console.log('⚠️  Redis 连接失败 (使用内存存储):', error.message)
    // 继续运行，使用内存存储
  }
}

// API 路由
app.use('/api/chat', chatRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/analytics', analyticsRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: db ? 'connected' : 'disconnected',
      redis: redisClient ? 'connected' : 'disconnected'
    }
  })
})

// 模拟聊天接口 (用于演示)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, riskLevel, userInfo } = req.body
    
    console.log(`📝 收到消息 [${sessionId}]: ${message}`)
    
    // 保存用户消息到数据库 (模拟)
    const userMessage = {
      id: uuidv4(),
      sessionId,
      type: 'user',
      content: message,
      timestamp: new Date(),
      riskLevel: riskLevel || 'unknown'
    }
    
    // 使用AI Agent服务生成回复
    const agentResponse = await agentService.generateResponse({
      message,
      sessionId,
      userInfo,
      riskLevel
    })
    
    // 风险评估
    const riskAssessmentResult = await riskAssessment.assessMessage({
      message,
      previousRiskLevel: riskLevel,
      conversationHistory: [] // 这里应该从数据库获取
    })
    
    // 构建响应
    const response = {
      message: agentResponse.content,
      riskLevel: riskAssessmentResult.level,
      userInfo: {
        ...userInfo,
        conversationDepth: (userInfo?.conversationDepth || 0) + 1,
        hasSharedEmotions: agentResponse.metadata?.emotionDetected || userInfo?.hasSharedEmotions,
        hasExpressedSuicidalThoughts: riskAssessmentResult.suicidalIndicators.length > 0
      },
      metadata: {
        riskLevel: riskAssessmentResult.level,
        suggestedServices: agentResponse.suggestedServices,
        emotionDetected: agentResponse.metadata?.emotionDetected,
        keywordsDetected: riskAssessmentResult.keywordsDetected
      }
    }
    
    // 保存AI回复到数据库 (模拟)
    const botMessage = {
      id: uuidv4(),
      sessionId,
      type: 'bot',
      content: response.message,
      timestamp: new Date(),
      riskLevel: response.riskLevel,
      metadata: response.metadata
    }
    
    console.log(`🤖 生成回复 [${sessionId}] 风险等级: ${response.riskLevel}`)
    
    // 如果是高风险，触发额外处理
    if (response.riskLevel === 'high' || response.riskLevel === 'critical') {
      console.log(`⚠️  高风险用户检测到 [${sessionId}] - 触发干预流程`)
      // 这里可以添加通知专业人员、记录日志等逻辑
    }
    
    res.json(response)
    
  } catch (error) {
    console.error('❌ 聊天接口错误:', error)
    res.status(500).json({
      message: '抱歉，我现在遇到了一些技术问题。如果你正处于紧急情况，请立即拨打危机热线：400-161-9995',
      riskLevel: 'unknown',
      error: true
    })
  }
})

// SPA 路由支持
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('🔥 服务器错误:', error)
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : '请稍后重试'
  })
})

// 启动服务器
async function startServer() {
  try {
    // 连接数据库
    await connectDB()
    await connectRedis()
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器启动成功`)
      console.log(`📍 本地地址: http://localhost:${PORT}`)
      console.log(`🕐 启动时间: ${new Date().toLocaleString('zh-CN')}`)
      console.log('─'.repeat(50))
    })
  } catch (error) {
    console.error('❌ 服务器启动失败:', error)
    process.exit(1)
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n📴 正在关闭服务器...')
  
  if (redisClient) {
    await redisClient.quit()
  }
  
  process.exit(0)
})

// 启动应用
if (require.main === module) {
  startServer()
}

module.exports = app