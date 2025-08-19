/**
 * 心理治疗 AI Agent 服务
 * 
 * 核心职责：
 * 1. 生成温和、共情的回复
 * 2. 识别用户情感状态
 * 3. 引导用户分享更多信息
 * 4. 避免提供任何可能有害的建议
 * 5. 在合适时机推荐专业服务
 * 
 * 设计原则：
 * - 绝对安全：不提供任何伤害信息
 * - 温和引导：使用疑问句和开放性问题
 * - 简短回应：每次1-2句话，避免说教
 * - 情感共鸣：表达理解和关心
 * - 循序渐进：逐步了解用户状况
 */

const { v4: uuidv4 } = require('uuid')

class PsychologicalAgent {
  constructor() {
    // 对话阶段
    this.conversationStages = {
      INITIAL: 'initial',        // 初次接触，建立信任
      EXPLORATION: 'exploration', // 探索情感和问题
      ASSESSMENT: 'assessment',   // 深入了解风险状况
      SUPPORT: 'support',        // 提供支持和资源
      CRISIS: 'crisis'           // 危机干预
    }
    
    // 情感关键词映射
    this.emotionKeywords = {
      sadness: ['难过', '伤心', '悲伤', '沮丧', '失落', '痛苦', '心痛'],
      anxiety: ['焦虑', '担心', '紧张', '害怕', '恐惧', '不安', '压力'],
      anger: ['愤怒', '生气', '气愤', '恼火', '暴躁', '火大', '讨厌'],
      loneliness: ['孤独', '寂寞', '独自', '没人', '一个人', '孤单', '无人'],
      hopelessness: ['绝望', '没希望', '没意义', '没用', '放弃', '算了', '无望']
    }
    
    // 风险关键词 (用于初步筛查)
    this.riskKeywords = {
      high: ['自杀', '死', '结束生命', '不想活', '离开这个世界'],
      medium: ['没意义', '绝望', '解脱', '消失', '结束一切'],
      indicators: ['计划', '方法', '时间', '地点', '准备好了']
    }
    
    // 响应模板库
    this.responseTemplates = {
      // 初次接触模板
      initial: [
        "我能感受到你现在可能不太好，如果愿意的话，可以跟我说说发生了什么吗？",
        "看起来你正在经历一些困难，我很想听听你的感受。",
        "感谢你愿意和我交流。你现在的心情怎么样？",
        "我注意到你可能需要有人倾听，我在这里陪着你。"
      ],
      
      // 探索阶段模板  
      exploration: [
        "这听起来真的很不容易，能告诉我这种感觉持续多久了吗？",
        "我能理解这对你来说很困难。最近有什么特别的事情让你感到困扰吗？",
        "你提到的感受我能感同身受。平时有没有人可以和你聊这些？",
        "听起来你承受了很多。除了这个，还有其他让你担心的事情吗？"
      ],
      
      // 评估阶段模板
      assessment: [
        "我很担心你现在的状况。你有没有想过要伤害自己？",
        "这些困难让你感到绝望吗？有没有想要结束一切的念头？",
        "你现在身边有人可以陪伴你吗？",
        "这样的感觉是不是让你觉得很孤单？"
      ],
      
      // 支持阶段模板
      support: [
        "我听到了你的痛苦，你不是一个人在面对这些。",
        "感谢你和我分享这些，能够说出来已经很勇敢了。",
        "你已经迈出了很重要的一步，愿意寻求帮助。",
        "这确实很困难，但我们可以一起找到一些支持的方式。"
      ],
      
      // 危机干预模板
      crisis: [
        "我非常担心你现在的安全。你现在在哪里？身边有人吗？",
        "我希望你能保证现在的安全。让我们联系一些可以立即帮助你的人。",
        "你现在的感受我理解，但我真的很担心你。我们需要确保你是安全的。",
        "这一刻很艰难，但请相信会有转机。让我帮你联系专业的帮助。"
      ]
    }
    
    // 服务推荐规则
    this.serviceRecommendations = {
      low: [],
      medium: [
        {
          type: 'assessment',
          label: '专业心理评估',
          priority: 1
        },
        {
          type: 'support', 
          label: '同伴支持群组',
          priority: 2
        }
      ],
      high: [
        {
          type: 'emergency',
          label: '联系紧急热线',
          priority: 1
        },
        {
          type: 'assessment',
          label: '紧急心理评估',
          priority: 2
        }
      ],
      critical: [
        {
          type: 'emergency',
          label: '立即拨打求助热线',
          priority: 1
        },
        {
          type: 'location',
          label: '获取位置并联系紧急服务',
          priority: 2
        }
      ]
    }
  }
  
  /**
   * 生成AI回复的主要方法
   */
  async generateResponse({ message, sessionId, userInfo, riskLevel }) {
    try {
      console.log(`🧠 [${sessionId}] 处理消息: "${message.substring(0, 50)}..."`)
      
      // 1. 分析用户消息
      const analysis = this.analyzeMessage(message, userInfo)
      
      // 2. 确定对话阶段
      const stage = this.determineConversationStage(analysis, userInfo, riskLevel)
      
      // 3. 生成回复内容
      const responseContent = this.generateResponseContent(analysis, stage, userInfo)
      
      // 4. 推荐相关服务
      const suggestedServices = this.recommendServices(analysis.riskLevel, stage)
      
      // 5. 构建完整回复
      const response = {
        content: responseContent,
        suggestedServices,
        metadata: {
          stage,
          emotionDetected: analysis.detectedEmotions.length > 0,
          riskKeywords: analysis.riskKeywords,
          confidence: analysis.confidence
        }
      }
      
      console.log(`🎯 [${sessionId}] 生成回复: ${stage} 阶段, 风险: ${analysis.riskLevel}`)
      
      return response
      
    } catch (error) {
      console.error('❌ Agent回复生成失败:', error)
      
      // 安全兜底回复
      return {
        content: "我想更好地理解你现在的感受。可以告诉我你现在最担心的是什么吗？",
        suggestedServices: [],
        metadata: {
          stage: 'fallback',
          error: true
        }
      }
    }
  }
  
  /**
   * 分析用户消息内容
   */
  analyzeMessage(message, userInfo) {
    const messageText = message.toLowerCase()
    
    // 检测情感
    const detectedEmotions = []
    for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
      if (keywords.some(keyword => messageText.includes(keyword))) {
        detectedEmotions.push(emotion)
      }
    }
    
    // 检测风险关键词
    const riskKeywords = []
    let riskLevel = 'low'
    
    // 高风险关键词检测
    if (this.riskKeywords.high.some(keyword => messageText.includes(keyword))) {
      riskLevel = 'critical'
      riskKeywords.push(...this.riskKeywords.high.filter(k => messageText.includes(k)))
    }
    // 中等风险关键词检测
    else if (this.riskKeywords.medium.some(keyword => messageText.includes(keyword))) {
      riskLevel = 'high'
      riskKeywords.push(...this.riskKeywords.medium.filter(k => messageText.includes(k)))
    }
    // 如果检测到绝望类情感
    else if (detectedEmotions.includes('hopelessness')) {
      riskLevel = 'medium'
    }
    
    // 计算置信度
    const confidence = this.calculateConfidence({
      emotionCount: detectedEmotions.length,
      riskKeywordCount: riskKeywords.length,
      messageLength: message.length,
      conversationDepth: userInfo?.conversationDepth || 0
    })
    
    return {
      detectedEmotions,
      riskKeywords,
      riskLevel,
      confidence,
      messageLength: message.length
    }
  }
  
  /**
   * 确定对话阶段
   */
  determineConversationStage(analysis, userInfo, currentRiskLevel) {
    const conversationDepth = userInfo?.conversationDepth || 0
    
    // 危机状态优先
    if (analysis.riskLevel === 'critical' || currentRiskLevel === 'critical') {
      return this.conversationStages.CRISIS
    }
    
    // 高风险进入评估阶段
    if (analysis.riskLevel === 'high' || currentRiskLevel === 'high') {
      return this.conversationStages.ASSESSMENT
    }
    
    // 基于对话深度判断
    if (conversationDepth === 0) {
      return this.conversationStages.INITIAL
    } else if (conversationDepth < 3) {
      return this.conversationStages.EXPLORATION
    } else if (conversationDepth < 6) {
      return this.conversationStages.ASSESSMENT
    } else {
      return this.conversationStages.SUPPORT
    }
  }
  
  /**
   * 生成回复内容
   */
  generateResponseContent(analysis, stage, userInfo) {
    let templates = this.responseTemplates[stage] || this.responseTemplates.initial
    
    // 根据情感状态调整回复
    if (analysis.detectedEmotions.includes('hopelessness')) {
      return "我听到了你的痛苦，这些感受一定很难承受。你现在身边有人可以陪伴你吗？"
    }
    
    if (analysis.detectedEmotions.includes('loneliness')) {
      return "感到孤独真的很不容易，但现在你不是一个人了。愿意告诉我更多吗？"
    }
    
    if (analysis.detectedEmotions.includes('anxiety')) {
      return "我能感受到你的担忧和不安。是什么事情让你特别焦虑呢？"
    }
    
    if (analysis.detectedEmotions.includes('sadness')) {
      return "听起来你现在很难过，我想更好地了解发生了什么。"
    }
    
    // 危机情况的特殊处理
    if (stage === this.conversationStages.CRISIS) {
      if (analysis.riskKeywords.includes('自杀') || analysis.riskKeywords.includes('死')) {
        return "我很担心你现在的安全。你能告诉我你现在在哪里吗？让我们一起找到可以帮助你的人。"
      }
    }
    
    // 默认从模板中选择
    const randomIndex = Math.floor(Math.random() * templates.length)
    return templates[randomIndex]
  }
  
  /**
   * 推荐相关服务
   */
  recommendServices(riskLevel, stage) {
    const services = this.serviceRecommendations[riskLevel] || []
    
    // 根据对话阶段调整服务推荐
    if (stage === this.conversationStages.CRISIS) {
      return [
        {
          type: 'emergency',
          label: '立即联系危机热线',
          priority: 1
        },
        {
          type: 'location',
          label: '获取紧急帮助',
          priority: 2
        }
      ]
    }
    
    return services
  }
  
  /**
   * 计算分析置信度
   */
  calculateConfidence({ emotionCount, riskKeywordCount, messageLength, conversationDepth }) {
    let confidence = 0.5 // 基础置信度
    
    // 情感关键词增加置信度
    confidence += emotionCount * 0.1
    
    // 风险关键词显著增加置信度
    confidence += riskKeywordCount * 0.3
    
    // 消息长度影响
    if (messageLength > 50) confidence += 0.1
    if (messageLength > 200) confidence += 0.1
    
    // 对话深度影响
    confidence += Math.min(conversationDepth * 0.05, 0.2)
    
    return Math.min(confidence, 1.0)
  }
}

// 创建全局Agent实例
const psychologicalAgent = new PsychologicalAgent()

/**
 * 主要的Agent服务接口
 */
const agentService = {
  /**
   * 生成回复
   */
  async generateResponse(params) {
    return await psychologicalAgent.generateResponse(params)
  },
  
  /**
   * 获取Agent状态
   */
  getStatus() {
    return {
      status: 'active',
      version: '1.0.0',
      capabilities: [
        'emotional_analysis',
        'risk_assessment', 
        'conversation_guidance',
        'service_recommendation'
      ],
      lastUpdate: new Date()
    }
  }
}

module.exports = agentService