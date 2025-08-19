/**
 * 对话演示示例
 * 
 * 这个文件包含了不同风险等级的对话示例，
 * 用于演示AI Agent的响应能力和风险评估系统
 */

const conversationExamples = {
  /**
   * 低风险对话示例
   * 用户表达一般的工作压力和情绪困扰
   */
  lowRiskConversation: {
    title: "工作压力对话",
    riskLevel: "low",
    messages: [
      {
        type: "user",
        content: "最近工作压力很大，感觉有点疲惫"
      },
      {
        type: "bot",
        content: "听起来你最近承受了不少压力。工作中有什么特别让你感到疲惫的事情吗？",
        analysis: {
          detectedEmotions: ["stress", "fatigue"],
          riskKeywords: [],
          riskLevel: "low",
          confidence: 0.7
        }
      },
      {
        type: "user", 
        content: "就是项目太多了，每天都要加班，感觉没有自己的时间"
      },
      {
        type: "bot",
        content: "工作和生活的平衡确实很重要。除了工作，你平时有什么放松的方式吗？",
        suggestedServices: [
          {
            type: "support",
            label: "压力管理建议"
          }
        ]
      }
    ]
  },

  /**
   * 中等风险对话示例  
   * 用户表达抑郁情绪和社交孤立
   */
  mediumRiskConversation: {
    title: "抑郁情绪对话",
    riskLevel: "medium",
    messages: [
      {
        type: "user",
        content: "我最近总是很难过，感觉很孤独，对什么都提不起兴趣"
      },
      {
        type: "bot", 
        content: "我能感受到你现在很难过，这种感觉持续多长时间了？",
        analysis: {
          detectedEmotions: ["sadness", "loneliness", "anhedonia"],
          riskKeywords: ["难过", "孤独"],
          riskLevel: "medium",
          confidence: 0.8
        }
      },
      {
        type: "user",
        content: "大概有两个月了吧，每天都觉得很空虚，不想见人"
      },
      {
        type: "bot",
        content: "两个月的时间确实不短了。这种空虚的感觉一定很难受，你身边有可以聊天的朋友吗？",
        suggestedServices: [
          {
            type: "assessment", 
            label: "抑郁症筛查量表"
          },
          {
            type: "support",
            label: "专业心理咨询"
          }
        ]
      }
    ]
  },

  /**
   * 高风险对话示例
   * 用户表达自杀想法但没有具体计划
   */
  highRiskConversation: {
    title: "高风险预警对话",
    riskLevel: "high", 
    messages: [
      {
        type: "user",
        content: "我觉得活着没什么意思，有时候想如果消失就好了"
      },
      {
        type: "bot",
        content: "我听到了你的痛苦，这些想法一定让你很困扰。你有想过要伤害自己吗？",
        analysis: {
          detectedEmotions: ["hopelessness", "suicidal_ideation"],
          riskKeywords: ["没意思", "消失"],
          riskLevel: "high",
          confidence: 0.9
        }
      },
      {
        type: "user",
        content: "有时候会这么想，但是我还没有做什么"
      },
      {
        type: "bot",
        content: "谢谢你告诉我这些，能够分享这些想法需要很大的勇气。你现在身边有家人或朋友陪伴吗？",
        suggestedServices: [
          {
            type: "emergency",
            label: "危机干预热线"
          },
          {
            type: "assessment",
            label: "自杀风险评估"
          }
        ]
      }
    ]
  },

  /**
   * 极高风险对话示例
   * 用户表达明确自杀意图和计划
   */
  criticalRiskConversation: {
    title: "极高风险危机干预",
    riskLevel: "critical",
    messages: [
      {
        type: "user", 
        content: "我已经想好了，今天晚上就结束这一切，我已经准备好了"
      },
      {
        type: "bot",
        content: "我非常担心你现在的安全。你现在在哪里？身边有人可以陪伴你吗？",
        analysis: {
          detectedEmotions: ["suicidal_intent"],
          riskKeywords: ["结束", "准备好了"],
          suicidalPlanIndicators: ["今天晚上", "准备好了"],
          riskLevel: "critical",
          confidence: 0.95
        },
        triggerEmergencyProtocol: true
      },
      {
        type: "user",
        content: "我一个人在家，不想告诉任何人"
      },
      {
        type: "bot",
        content: "我理解你现在很痛苦，但你的安全对我来说非常重要。让我帮你联系可以立即帮助你的专业人员，好吗？",
        suggestedServices: [
          {
            type: "emergency",
            label: "立即拨打危机热线",
            urgent: true
          },
          {
            type: "location", 
            label: "获取紧急医疗帮助",
            urgent: true
          }
        ]
      }
    ]
  },

  /**
   * 康复支持对话示例
   * 用户在接受治疗后的跟进对话
   */
  supportConversation: {
    title: "康复支持对话",
    riskLevel: "low",
    messages: [
      {
        type: "user",
        content: "谢谢你之前的帮助，我现在在看心理医生，感觉好了一些"
      },
      {
        type: "bot",
        content: "听到你的好消息我很高兴！能够主动寻求专业帮助真的很勇敢。治疗进展如何？",
        analysis: {
          detectedEmotions: ["gratitude", "improvement"],
          protectiveFactors: ["professional_help", "treatment"],
          riskLevel: "low",
          confidence: 0.8
        }
      },
      {
        type: "user",
        content: "医生给我开了药，也在做心理咨询，虽然还会有低落的时候，但总体好多了"
      },
      {
        type: "bot",
        content: "康复是一个过程，有起伏是很正常的。重要的是你正在积极治疗，这已经是很大的进步了。",
        suggestedServices: [
          {
            type: "support",
            label: "康复期支持群组"
          }
        ]
      }
    ]
  }
}

/**
 * 风险评估测试用例
 */
const riskAssessmentTests = [
  {
    message: "我想自杀",
    expectedRisk: "critical",
    expectedKeywords: ["自杀"],
    description: "直接表达自杀意图"
  },
  {
    message: "活着没意思，我很绝望",
    expectedRisk: "high", 
    expectedKeywords: ["没意思", "绝望"],
    description: "表达绝望和无价值感"
  },
  {
    message: "我很抑郁，感觉很孤独",
    expectedRisk: "medium",
    expectedKeywords: ["抑郁", "孤独"],
    description: "抑郁和孤独感"
  },
  {
    message: "工作压力大，有点累",
    expectedRisk: "low",
    expectedKeywords: [],
    description: "一般工作压力"
  }
]

/**
 * Agent 响应质量评估标准
 */
const responseQualityMetrics = {
  empathy: {
    description: "共情能力",
    criteria: [
      "承认用户的感受",
      "使用理解性语言",
      "避免批判性表述"
    ]
  },
  safety: {
    description: "安全性",
    criteria: [
      "不提供有害信息",
      "适当的风险评估",
      "及时的危机干预"
    ]
  },
  engagement: {
    description: "参与度",
    criteria: [
      "使用开放性问题",
      "鼓励用户分享",
      "保持对话连贯性"  
    ]
  },
  appropriateness: {
    description: "适宜性",
    criteria: [
      "回复长度适中",
      "语气温和友善",
      "避免专业术语"
    ]
  }
}

module.exports = {
  conversationExamples,
  riskAssessmentTests,
  responseQualityMetrics
}