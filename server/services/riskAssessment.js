/**
 * 风险评估服务
 * 
 * 核心功能：
 * 1. 分析用户消息中的自杀风险指标
 * 2. 评估风险等级 (low, medium, high, critical)
 * 3. 识别关键风险词汇和情感状态
 * 4. 提供干预建议
 * 
 * 风险等级定义：
 * - unknown: 未评估状态
 * - low: 一般心理压力，需要情感支持
 * - medium: 明显抑郁情绪，需要关注和专业建议
 * - high: 有自杀想法，需要紧急关注和干预
 * - critical: 有具体自杀计划，需要立即干预
 */

class RiskAssessmentService {
  constructor() {
    // 自杀风险关键词分级
    this.riskKeywords = {
      // 极高风险 - 表达明确自杀意图
      critical: {
        keywords: [
          '自杀', '杀死自己', '结束生命', '不想活了', '想死',
          '自我了结', '解脱', '一了百了', '去死', '死掉算了'
        ],
        weight: 1.0,
        minOccurrence: 1
      },
      
      // 高风险 - 表达绝望和无价值感
      high: {
        keywords: [
          '没意义', '没价值', '没用', '废物', '累赘',
          '绝望', '无望', '放弃', '算了', '结束一切',
          '消失', '离开这个世界', '不存在'
        ],
        weight: 0.8,
        minOccurrence: 2
      },
      
      // 中等风险 - 抑郁和负面情绪指标
      medium: {
        keywords: [
          '抑郁', '沮丧', '失落', '空虚', '麻木',
          '孤独', '寂寞', '痛苦', '煎熬', '折磨',
          '疲惫', '累', '撑不下去', '坚持不了'
        ],
        weight: 0.6,
        minOccurrence: 3
      }
    }
    
    // 自杀计划指标 - 增加风险评分
    this.suicidalPlanIndicators = [
      '计划', '准备', '方法', '时间', '地点',
      '安排好了', '准备好了', '决定了', '想好了',
      '买了', '准备了', '找到了'
    ]
    
    // 保护因子 - 降低风险评分
    this.protectiveFactors = [
      '家人', '朋友', '孩子', '父母', '爱人',
      '责任', '希望', '未来', '梦想', '目标',
      '信仰', '宗教', '治疗', '医生', '药物'
    ]
    
    // 情感状态权重
    this.emotionWeights = {
      hopelessness: 0.9,    // 绝望感
      worthlessness: 0.8,   // 无价值感
      sadness: 0.6,         // 悲伤
      anxiety: 0.5,         // 焦虑
      anger: 0.4,           // 愤怒
      loneliness: 0.7       // 孤独感
    }
  }
  
  /**
   * 主要的风险评估方法
   */
  async assessMessage({ message, previousRiskLevel, userInfo, conversationHistory = [] }) {
    try {
      console.log(`🔍 评估风险: "${message.substring(0, 50)}..."`)
      
      const messageText = message.toLowerCase()
      
      // 1. 关键词分析
      const keywordAnalysis = this.analyzeKeywords(messageText)
      
      // 2. 自杀计划评估
      const planAssessment = this.assessSuicidalPlan(messageText)
      
      // 3. 保护因子评估
      const protectiveAssessment = this.assessProtectiveFactors(messageText)
      
      // 4. 情感状态分析
      const emotionalState = this.analyzeEmotionalState(messageText)
      
      // 5. 计算综合风险评分
      const riskScore = this.calculateRiskScore({
        keywordAnalysis,
        planAssessment,
        protectiveAssessment,
        emotionalState,
        previousRiskLevel,
        userInfo
      })
      
      // 6. 确定风险等级
      const riskLevel = this.determineRiskLevel(riskScore)
      
      // 7. 生成干预建议
      const interventions = this.generateInterventions(riskLevel, keywordAnalysis, planAssessment)
      
      const result = {
        level: riskLevel,
        score: riskScore,
        confidence: this.calculateConfidence(keywordAnalysis, emotionalState),
        keywordsDetected: keywordAnalysis.detected,
        suicidalIndicators: planAssessment.indicators,
        protectiveFactors: protectiveAssessment.factors,
        emotionalState,
        interventions,
        previousLevel: previousRiskLevel,
        timestamp: new Date()
      }
      
      console.log(`📊 风险评估完成: ${riskLevel} (${riskScore.toFixed(2)})`)
      
      return result
      
    } catch (error) {
      console.error('❌ 风险评估失败:', error)
      
      // 安全兜底评估
      return {
        level: 'medium',
        score: 0.5,
        confidence: 0.3,
        keywordsDetected: [],
        suicidalIndicators: [],
        protectiveFactors: [],
        emotionalState: { primary: 'unknown' },
        interventions: ['professional_consultation'],
        error: true,
        timestamp: new Date()
      }
    }
  }
  
  /**
   * 关键词分析
   */
  analyzeKeywords(messageText) {
    const detected = []
    let totalWeight = 0
    let maxCategoryWeight = 0
    
    for (const [category, config] of Object.entries(this.riskKeywords)) {
      const foundKeywords = config.keywords.filter(keyword => 
        messageText.includes(keyword)
      )
      
      if (foundKeywords.length >= config.minOccurrence) {
        detected.push(...foundKeywords)
        totalWeight += config.weight * foundKeywords.length
        maxCategoryWeight = Math.max(maxCategoryWeight, config.weight)
      }
    }
    
    return {
      detected: [...new Set(detected)], // 去重
      totalWeight,
      maxCategoryWeight,
      count: detected.length
    }
  }
  
  /**
   * 评估自杀计划指标
   */
  assessSuicidalPlan(messageText) {
    const indicators = this.suicidalPlanIndicators.filter(indicator =>
      messageText.includes(indicator)
    )
    
    // 计划指标权重
    let planScore = 0
    if (indicators.length > 0) {
      planScore = Math.min(indicators.length * 0.3, 1.0)
    }
    
    return {
      indicators,
      score: planScore,
      hasPlan: indicators.length > 0
    }
  }
  
  /**
   * 评估保护因子
   */
  assessProtectiveFactors(messageText) {
    const factors = this.protectiveFactors.filter(factor =>
      messageText.includes(factor)
    )
    
    // 保护因子降低风险
    const protectionScore = Math.min(factors.length * 0.15, 0.5)
    
    return {
      factors,
      score: protectionScore,
      hasProtection: factors.length > 0
    }
  }
  
  /**
   * 分析情感状态
   */
  analyzeEmotionalState(messageText) {
    const emotionMap = {
      hopelessness: ['绝望', '无望', '没希望', '看不到希望'],
      worthlessness: ['没用', '废物', '没价值', '累赘', '多余'],
      sadness: ['难过', '伤心', '悲伤', '痛苦', '心痛'],
      anxiety: ['焦虑', '担心', '害怕', '紧张', '恐惧'],
      anger: ['愤怒', '生气', '恨', '讨厌', '气愤'],
      loneliness: ['孤独', '寂寞', '一个人', '没人理解', '孤单']
    }
    
    const detectedEmotions = {}
    let primaryEmotion = 'unknown'
    let maxWeight = 0
    
    for (const [emotion, keywords] of Object.entries(emotionMap)) {
      const matches = keywords.filter(keyword => messageText.includes(keyword))
      if (matches.length > 0) {
        const weight = this.emotionWeights[emotion] || 0.5
        detectedEmotions[emotion] = {
          keywords: matches,
          weight: weight * matches.length
        }
        
        if (detectedEmotions[emotion].weight > maxWeight) {
          maxWeight = detectedEmotions[emotion].weight
          primaryEmotion = emotion
        }
      }
    }
    
    return {
      primary: primaryEmotion,
      detected: detectedEmotions,
      intensity: maxWeight
    }
  }
  
  /**
   * 计算综合风险评分
   */
  calculateRiskScore({
    keywordAnalysis,
    planAssessment,
    protectiveAssessment,
    emotionalState,
    previousRiskLevel,
    userInfo
  }) {
    let score = 0
    
    // 基础分数：关键词权重
    score += keywordAnalysis.totalWeight * 0.4
    
    // 自杀计划加权
    score += planAssessment.score * 0.3
    
    // 情感状态加权
    score += emotionalState.intensity * 0.2
    
    // 历史风险等级影响
    const prevLevelWeight = {
      'unknown': 0,
      'low': 0.1,
      'medium': 0.2,
      'high': 0.3,
      'critical': 0.4
    }
    score += prevLevelWeight[previousRiskLevel] || 0
    
    // 对话深度影响
    const depth = userInfo?.conversationDepth || 0
    if (depth > 5) score += 0.1 // 深度对话可能暴露更多风险
    
    // 保护因子降低评分
    score -= protectiveAssessment.score
    
    // 确保评分在0-1范围内
    return Math.max(0, Math.min(1, score))
  }
  
  /**
   * 根据评分确定风险等级
   */
  determineRiskLevel(score) {
    if (score >= 0.8) return 'critical'
    if (score >= 0.6) return 'high'
    if (score >= 0.3) return 'medium'
    return 'low'
  }
  
  /**
   * 计算评估置信度
   */
  calculateConfidence(keywordAnalysis, emotionalState) {
    let confidence = 0.5
    
    // 关键词匹配增加置信度
    confidence += keywordAnalysis.count * 0.1
    
    // 明确的情感状态增加置信度
    if (emotionalState.primary !== 'unknown') {
      confidence += 0.2
    }
    
    // 高权重关键词增加置信度
    if (keywordAnalysis.maxCategoryWeight > 0.8) {
      confidence += 0.2
    }
    
    return Math.min(confidence, 1.0)
  }
  
  /**
   * 生成干预建议
   */
  generateInterventions(riskLevel, keywordAnalysis, planAssessment) {
    const interventions = []
    
    switch (riskLevel) {
      case 'critical':
        interventions.push(
          'immediate_professional_intervention',
          'crisis_hotline_contact',
          'emergency_services_notification',
          'safety_planning'
        )
        if (planAssessment.hasPlan) {
          interventions.push('remove_lethal_means')
        }
        break
        
      case 'high':
        interventions.push(
          'professional_consultation',
          'crisis_hotline_provision',
          'safety_assessment',
          'support_system_activation'
        )
        break
        
      case 'medium':
        interventions.push(
          'mental_health_screening',
          'counseling_recommendation',
          'support_resources_provision',
          'follow_up_scheduled'
        )
        break
        
      case 'low':
        interventions.push(
          'emotional_support',
          'self_help_resources',
          'wellness_activities'
        )
        break
    }
    
    return interventions
  }
  
  /**
   * 获取服务状态
   */
  getStatus() {
    return {
      status: 'active',
      version: '1.0.0',
      categories: Object.keys(this.riskKeywords),
      totalKeywords: Object.values(this.riskKeywords)
        .reduce((sum, cat) => sum + cat.keywords.length, 0),
      lastUpdate: new Date()
    }
  }
}

// 创建全局风险评估服务实例
const riskAssessmentService = new RiskAssessmentService()

module.exports = {
  assessMessage: (params) => riskAssessmentService.assessMessage(params),
  getStatus: () => riskAssessmentService.getStatus()
}