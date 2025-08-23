import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { selectEmoji, getScenarioEmoji, createEmojiMessage, extractEmojiInstruction } from '../utils/emojiConfig.js'

const ChatContext = createContext()

// PHQ-9 抑郁症状量表
const phq9Questions = {
  id: 'phq9',
  title: '患者健康问卷抑郁症状量表 (PHQ-9)',
  description: '基于《上文》较明确明用户已表达为抑郁感时，推荐使用此量表评估抑郁症状严重程度',
  questions: [
    {
      id: 1,
      text: '做事时提不起劲或没有兴趣',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 2,
      text: '感到心情低落、沮丧或绝望',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 3,
      text: '入睡困难、睡不安稳或睡眠过多',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 4,
      text: '感到疲倦或没有活力',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 5,
      text: '食欲不振或吃太多',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 6,
      text: '觉得自己很笨、内疚或让自己或家人失望',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 7,
      text: '注意力难以集中，例如看书或看电视时',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 8,
      text: '行动或说话速度变得缓慢，或坐立不安、烦躁易怒',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 9,
      text: '有不如一死了之的念头，或想伤害自己',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    }
  ],
  scoring: {
    0: { 
      level: 'minimal', 
      description: '无抑郁症状 (0-4分)：过去两周内未出现或仅出现轻微的抑郁相关症状，心理状态较为稳定。',
      recommendation: '继续保持良好的心理状态，建议保持规律作息和健康的生活方式。'
    },
    5: { 
      level: 'mild', 
      description: '轻度抑郁症状 (5-9分)：存在一定程度的抑郁症状，可能对日常生活产生轻微影响。',
      recommendation: '建议关注情绪变化，通过自我调节（如增加社交活动、适度运动等）改善状态。必要时寻求专业心理支持。'
    },
    10: { 
      level: 'moderate', 
      description: '中度抑郁症状 (10-14分)：抑郁症状较为明显，对工作、生活及人际关系可能产生一定冲击。',
      recommendation: '应当重视，建议主动寻求心理咨询师或医生的帮助，进行专业评估和干预。'
    },
    15: { 
      level: 'moderate_severe', 
      description: '中重度抑郁症状 (15-19分)：抑郁症状为严重，明显影响日常功能。需及时就医。',
      recommendation: '在专业人员指导下进行心理治疗或药物治疗。'
    },
    20: { 
      level: 'severe', 
      description: '重度抑郁症状 (20-27分)：抑郁症状非常严重，可能伴随明显的绝望感和功能障碍。',
      recommendation: '存在较高的心理风险，应立即寻求精神科医生或专业医疗机构的帮助，进行系统治疗和监护。'
    }
  },
  specialAttention: '项目9特殊关注：项目9涉及自杀意念或自伤想法，无论得分高低，均需给予重点关注，必要时进行紧急干预。',
  disclaimer: 'PHQ-9只作为抑郁症状的初步筛查工具，通过各项目得分能够解抑郁症状的具体表现，如果存在症状，兴趣减退、自责等问题，但最终结果不能替代专业诊断，若总分较高或项目9得分>1分，需结合临床访谈和其他评估手段综合判断，确保为有需要的人提供及时、恰当的支持和治疗。'
}

// GAD-7 焦虑症状量表
const gad7Questions = {
  id: 'gad7',
  title: '广泛性焦虑障碍量表 (GAD-7)',
  description: '基于《上文》较明确明用户不明确由就是焦虑障碍时，推荐使用此量表评估焦虑症状',
  questions: [
    {
      id: 1,
      text: '感到紧张、焦虑或坐立不安',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 2,
      text: '无法停止或控制担忧',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 3,
      text: '对各种事情过度担忧',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 4,
      text: '难以放松下来',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 5,
      text: '因紧张而感到难以静坐',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 6,
      text: '感到害怕，好像有可怕的事情即将发生',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    },
    {
      id: 7,
      text: '感到心烦意乱或易于干躁愤怒',
      options: [
        { value: 0, label: '没有', score: 0 },
        { value: 1, label: '几天', score: 1 },
        { value: 2, label: '一半以上天数', score: 2 },
        { value: 3, label: '几乎每天', score: 3 }
      ]
    }
  ],
  scoring: {
    0: { 
      level: 'minimal', 
      description: '无焦虑症状 (0-4分)：过去两周内未出现或仅出现轻微的焦虑相关症状，心理状态较为平稳，对日常工作生活无明显影响。',
      recommendation: '继续保持良好的心理状态和生活习惯。'
    },
    5: { 
      level: 'mild', 
      description: '轻度焦虑症状 (5-9分)：存在轻微焦虑症状，可能偶尔感到紧张、担心等表现，但对工作效率、人际关系等生活方式影响相对较小。',
      recommendation: '建议关注情绪健康，规律作息自我调节万式，积缓解压力技巧。'
    },
    10: { 
      level: 'moderate', 
      description: '中度焦虑症状 (10-14分)：焦虑症状较为明显，频繁出现紧张、难以控制担忧等表现，对日常工作效率、人际关系产生一定冲击。',
      recommendation: '应主动寻求心理咨询师的帮助，进行专业的情绪疏导和干预。'
    },
    15: { 
      level: 'severe', 
      description: '重度焦虑症状 (15-21分)：焦虑症状严重，持续处于紧张不安状态，过度担忧难以缓解，明显影响日常工作和生活功能。',
      recommendation: '需及时就医，在专业医生指导下进行心理治疗，必要时结合药物治疗。'
    }
  },
  disclaimer: 'GAD-7是广泛应用的焦虑症状筛查工具，能快速识别焦虑的核心表现，但量表结果仅作为初步评估依据，不能替代专业诊断。若总分较高或症状持续加重，需结合临床访谈和其他评估手段综合判断，确保为有需要的人提供及时、恰当的支持和治疗，尤其对于残疾人员工群体，可结合其工作压力情况制定针对性的减压方案。'
}

const mockMessages = [
  {
    id: uuidv4(),
    type: 'bot',
    content: '你好，我很高兴你愿意和我聊聊。我是来倾听的，如果你愿意，可以告诉我今天你的感受如何？',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10分钟前
  },
  {
    id: uuidv4(),
    type: 'user', 
    content: '我最近感到很焦虑，特别是工作压力很大，不知道该怎么办...',
    sender: 'user',
    timestamp: new Date(Date.now() - 9 * 60 * 1000) // 9分钟前
  },
  {
    id: uuidv4(),
    type: 'bot',
    content: '我理解你现在的感受，工作压力确实会让人感到焦虑。你愿意和我分享一下具体是什么工作情况让你感到压力吗？',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8分钟前
    metadata: {
      riskLevel: 'medium',
      suggestedServices: [
        { type: 'support', label: '情感支持技巧' }
      ]
    }
  },
  {
    id: uuidv4(),
    type: 'user',
    content: '主要是项目deadline很紧，同事关系也有些紧张，我总是担心做不好会被批评...',
    sender: 'user',
    timestamp: new Date(Date.now() - 7 * 60 * 1000) // 7分钟前
  },
  {
    id: uuidv4(),
    type: 'bot',
    content: '听起来你承受着来自多个方面的压力。担心表现不佳是很正常的感受。让我们先试着一起做一些简单的放松练习，可以吗？',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 6 * 60 * 1000), // 6分钟前
    metadata: {
      riskLevel: 'medium',
      suggestedServices: [
        { type: 'support', label: '呼吸放松练习' },
        { type: 'assessment', label: '焦虑自我评估' }
      ]
    }
  },
  {
    id: uuidv4(),
    type: 'bot',
    content: '', // 空内容，这是一个纯快速回答消息
    sender: 'assistant',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
    isQuickReply: true, // 标识这是一个快速回答消息
    quickReplyData: {
      question: '是为本人咨询的吗',
      options: [
        { value: 'yes', label: '是' },
        { value: 'no', label: '不是' }
      ],
      selectedOption: null // 记录用户选择
    }
  }
]

const initialState = {
  messages: mockMessages, // 使用mock数据而不是空数组
  isTyping: false,
  sessionId: null,
  userRiskLevel: 'medium', // 设置为medium来显示风险评估
  userInfo: {
    hasSharedEmotions: true,
    hasExpressedSuicidalThoughts: false,
    conversationDepth: 2
  },
  services: {
    emergency: false,
    counseling: false,
    games: false,
    assessment: false
  },
  userProfile: {
    isForSelf: null, // 是否为本人咨询
    condition: null, // 确诊/怀疑抑郁症
    symptoms: null, // 症状情况
    demographics: {
      age: null,
      gender: null,
      location: null
    },
    questionnaire: {
      responses: [], // 问卷回答记录
      scores: {} // 各类评估分数
    },
    conversationData: {
      keywordMatches: [], // 关键词匹配记录
      emotionAnalysis: [], // 情感分析结果
      riskAssessment: [] // 风险评估历史
    }
  },
  psychologicalTest: {
    hasBeenOffered: false, // 是否已经提供过测试入口
    hasCompleted: false, // 是否已经完成测试
    currentTest: null, // 当前测试信息
    testType: null, // 测试类型：'phq9' 或 'gad7'
    isActive: false, // 测试是否进行中
    currentQuestionIndex: 0, // 当前题目索引
    answers: [], // 用户答案
    startTime: null,
    endTime: null,
    totalScore: null
  },
  gameRecommended: false, // 是否已经推荐过游戏
  wearableDataRequest: {
    isRequested: false, // 是否正在请求穿戴数据
    hasBeenRequested: false, // 是否已经请求过
    data: null, // 用户提交的穿戴数据
    triggerKeywords: [] // 触发的关键词
  }
}

function chatReducer(state, action) {
  switch (action.type) {
    case 'INIT_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId || uuidv4()
      }
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, {
          id: uuidv4(),
          ...action.payload,
          timestamp: new Date()
        }]
      }
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      }
    
    case 'UPDATE_RISK_LEVEL':
      return {
        ...state,
        userRiskLevel: action.payload
      }
    
    case 'UPDATE_USER_INFO':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload
        }
      }
    
    case 'TOGGLE_SERVICE':
      return {
        ...state,
        services: {
          ...state.services,
          [action.payload]: !state.services[action.payload]
        }
      }
    
    case 'UPDATE_QUICK_REPLY_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.messageId 
            ? {
                ...msg,
                quickReplyData: {
                  ...msg.quickReplyData,
                  selectedOption: action.payload.selectedOption
                }
              }
            : msg
        )
      }
    
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.payload
        }
      }
    
    case 'ADD_CONVERSATION_DATA':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          conversationData: {
            ...state.userProfile.conversationData,
            [action.payload.type]: [
              ...state.userProfile.conversationData[action.payload.type],
              action.payload.data
            ]
          }
        }
      }
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      }
    
    case 'START_PSYCHOLOGICAL_TEST':
      return {
        ...state,
        psychologicalTest: {
          ...state.psychologicalTest,
          hasBeenOffered: true,
          isActive: true,
          currentTest: action.payload.testData,
          testType: action.payload.testType,
          currentQuestionIndex: 0,
          answers: [],
          startTime: new Date(),
          endTime: null,
          totalScore: null
        }
      }
    
    case 'ANSWER_TEST_QUESTION':
      return {
        ...state,
        psychologicalTest: {
          ...state.psychologicalTest,
          answers: [...state.psychologicalTest.answers, action.payload],
          currentQuestionIndex: state.psychologicalTest.currentQuestionIndex + 1
        }
      }
    
    case 'COMPLETE_PSYCHOLOGICAL_TEST':
      return {
        ...state,
        psychologicalTest: {
          ...state.psychologicalTest,
          isActive: false,
          hasCompleted: true,
          endTime: new Date(),
          totalScore: action.payload.totalScore
        }
      }
    
    case 'MARK_TEST_OFFERED':
      return {
        ...state,
        psychologicalTest: {
          ...state.psychologicalTest,
          hasBeenOffered: true
        }
      }
    
    case 'MARK_GAME_RECOMMENDED':
      return {
        ...state,
        gameRecommended: true
      }
    
    case 'REQUEST_WEARABLE_DATA':
      return {
        ...state,
        wearableDataRequest: {
          ...state.wearableDataRequest,
          isRequested: true,
          hasBeenRequested: true,
          triggerKeywords: action.payload.keywords || []
        }
      }
    
    case 'SUBMIT_WEARABLE_DATA':
      return {
        ...state,
        wearableDataRequest: {
          ...state.wearableDataRequest,
          isRequested: false,
          data: action.payload.data
        }
      }
    
    case 'CLOSE_WEARABLE_DATA_REQUEST':
      return {
        ...state,
        wearableDataRequest: {
          ...state.wearableDataRequest,
          isRequested: false
        }
      }
    
    case 'CLEAR_CHAT':
      return {
        ...initialState,
        sessionId: uuidv4(),
        psychologicalTest: {
          ...initialState.psychologicalTest,
          testType: null
        },
        gameRecommended: false
      }
    
    default:
      return state
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  useEffect(() => {
    dispatch({ type: 'INIT_SESSION', payload: { sessionId: uuidv4() } })
  }, [])

  const addMessage = (message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message })
  }

  /**
   * 添加消息并处理表情包逻辑
   * @param {Object} message - 消息对象
   * @param {boolean} autoEmoji - 是否自动添加表情包
   */
  const addMessageWithEmoji = (message, autoEmoji = true) => {
    // 如果是AI消息，检查表情包指令
    if (message.type === 'bot' && message.sender === 'assistant' && message.content) {
      const { cleanContent, emojiPath } = extractEmojiInstruction(message.content)
      
      // 更新消息内容（移除表情包指令）
      if (cleanContent !== message.content) {
        message.content = cleanContent
      }
      
      // 添加文本消息
      addMessage(message)
      
      // 如果有表情包指令，添加独立的表情包消息
      if (emojiPath) {
        setTimeout(() => {
          const emojiMessage = createEmojiMessage(emojiPath)
          if (emojiMessage) {
            addMessage({
              ...emojiMessage,
              id: uuidv4()
            })
          }
        }, 500) // 稍微延迟显示表情包
      }
      // 禁用自动表情包，只保留指令触发
      // } else if (autoEmoji) {
      //   const selectedEmoji = selectEmoji(message.content, '', state.userRiskLevel)
      //   if (selectedEmoji) {
      //     setTimeout(() => {
      //       const emojiMessage = createEmojiMessage(selectedEmoji)
      //       if (emojiMessage) {
      //         addMessage({
      //           ...emojiMessage,
      //           id: uuidv4()
      //         })
      //       }
      //     }, 800)
      //   }
      // }
    } else {
      // 非AI消息直接添加
      addMessage(message)
    }
  }

  const setTyping = (isTyping) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping })
  }

  const updateRiskLevel = (level) => {
    dispatch({ type: 'UPDATE_RISK_LEVEL', payload: level })
  }

  const updateUserInfo = (info) => {
    dispatch({ type: 'UPDATE_USER_INFO', payload: info })
  }

  const toggleService = (service) => {
    dispatch({ type: 'TOGGLE_SERVICE', payload: service })
  }

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' })
  }

  const updateQuickReplyMessage = (messageId, selectedOption) => {
    dispatch({ type: 'UPDATE_QUICK_REPLY_MESSAGE', payload: { messageId, selectedOption } })
  }

  /**
   * 根据用户对话内容判断推荐的测试类型
   * 暂时使用关键词匹配，后续可通过agent回复的词条来决定
   * @param {string} userMessage - 用户消息内容
   * @returns {string} 'phq9' | 'gad7'
   */
  const determineTestType = (userMessage = '') => {
    // 获取最近几条用户消息进行综合判断
    const recentUserMessages = state.messages
      .filter(msg => msg.type === 'user')
      .slice(-5)
      .map(msg => msg.content)
      .join(' ')
    
    const allText = (recentUserMessages + ' ' + userMessage).toLowerCase()
    
    // 抑郁症状相关关键词
    const depressionKeywords = ['抑郁', '沮丧', '绝望', '低落', '没兴趣', '提不起劲', '疲倦', '睡眠', '食欲', '自责', '注意力', '自杀', '伤害自己']
    
    // 焦虑症状相关关键词  
    const anxietyKeywords = ['焦虑', '紧张', '担心', '不安', '坐立不安', '担忧', '害怕', '恐慌', '心烦', '放松不下来']
    
    const depressionScore = depressionKeywords.filter(keyword => allText.includes(keyword)).length
    const anxietyScore = anxietyKeywords.filter(keyword => allText.includes(keyword)).length
    
    // 如果焦虑关键词更多，推荐GAD-7；否则默认PHQ-9
    return anxietyScore > depressionScore ? 'gad7' : 'phq9'
  }

  /**
   * 获取指定类型的测试量表
   * @param {string} testType - 测试类型 'phq9' | 'gad7'  
   * @returns {object} 测试量表对象
   */
  const getTestQuestions = (testType) => {
    return testType === 'gad7' ? gad7Questions : phq9Questions
  }

  // 心理测试相关函数
  const startPsychologicalTest = (testType = null) => {
    // 如果没有指定测试类型，则根据对话内容判断
    const finalTestType = testType || determineTestType()
    const testQuestions = getTestQuestions(finalTestType)
    
    dispatch({ 
      type: 'START_PSYCHOLOGICAL_TEST', 
      payload: { 
        testData: testQuestions,
        testType: finalTestType
      } 
    })
    
    // 添加测试开始的消息
    addMessageWithEmoji({
      type: 'bot',
      content: `好的，我们开始进行${testQuestions.title}。${testQuestions.description}。请根据你的真实感受回答每个问题。 emoji:comfort`,
      sender: 'assistant'
    })
    
    // 延迟显示第一道题
    setTimeout(() => {
      showNextTestQuestion(0, testQuestions)
    }, 1500)
  }

  const showNextTestQuestion = (questionIndex, testQuestions = null) => {
    // 如果没有传入测试题目，使用当前测试的题目
    const currentTestQuestions = testQuestions || state.psychologicalTest.currentTest
    const question = currentTestQuestions?.questions[questionIndex]
    
    if (question) {
      const totalQuestions = currentTestQuestions.questions.length
      addMessage({
        type: 'bot',
        content: '',
        sender: 'assistant',
        isQuickReply: true,
        quickReplyData: {
          question: `问题 ${questionIndex + 1}/${totalQuestions}: ${question.text}`,
          options: question.options.map(opt => ({
            value: opt.value,
            label: opt.label,
            score: opt.score,
            questionId: question.id
          })),
          selectedOption: null,
          isTestQuestion: true,
          questionIndex: questionIndex
        }
      })
    }
  }

  const answerTestQuestion = (questionIndex, answer) => {
    const currentTest = state.psychologicalTest.currentTest
    
    dispatch({ 
      type: 'ANSWER_TEST_QUESTION', 
      payload: {
        questionId: currentTest.questions[questionIndex].id,
        questionIndex: questionIndex,
        answer: answer,
        timestamp: new Date()
      }
    })

    // 检查是否完成所有题目
    const nextIndex = questionIndex + 1
    if (nextIndex >= currentTest.questions.length) {
      // 计算总分并完成测试
      const totalScore = [...state.psychologicalTest.answers, {
        questionIndex: questionIndex,
        answer: answer
      }].reduce((sum, ans) => sum + ans.answer.score, 0)
      
      completePsychologicalTest(totalScore)
    } else {
      // 显示下一道题
      setTimeout(() => {
        showNextTestQuestion(nextIndex)
      }, 1500)
    }
  }

  const completePsychologicalTest = (totalScore) => {
    dispatch({ 
      type: 'COMPLETE_PSYCHOLOGICAL_TEST', 
      payload: { totalScore } 
    })

    const currentTest = state.psychologicalTest.currentTest
    
    // 根据分数给出结果
    const getScoreLevel = (score, scoring) => {
      const scoreKeys = Object.keys(scoring).map(Number).sort((a, b) => b - a)
      for (const threshold of scoreKeys) {
        if (score >= threshold) {
          return scoring[threshold]
        }
      }
      return scoring[0]
    }

    const result = getScoreLevel(totalScore, currentTest.scoring)
    
    // 检查是否有第9题的特殊情况（自杀意念）
    let specialWarning = ''
    if (currentTest.id === 'phq9') {
      const question9Answer = state.psychologicalTest.answers.find(ans => ans.questionIndex === 8)
      if (question9Answer && question9Answer.answer.score > 0) {
        specialWarning = `\n\n⚠️ 特别关注：检测到你可能存在自伤或自杀想法，这需要特别重视。建议立即寻求专业帮助，或拨打24小时心理危机干预热线：400-161-9995`
      }
    }
    
    // 发送测试结果
    setTimeout(() => {
      addMessageWithEmoji({
        type: 'bot',
        content: `${currentTest.title}测试完成！\n\n你的总分是 ${totalScore} 分。\n\n评估结果：${result.description}\n\n专业建议：${result.recommendation}${specialWarning}\n\n${currentTest.disclaimer} emoji:encourage`,
        sender: 'assistant',
        metadata: {
          testResult: {
            score: totalScore,
            level: result.level,
            description: result.description,
            recommendation: result.recommendation,
            testId: currentTest.id,
            testType: state.psychologicalTest.testType,
            completedAt: new Date(),
            hasSpecialWarning: specialWarning !== ''
          }
        }
      })
      
      // 检查是否应该推荐放松游戏（低风险用户）
      const shouldRecommendGame = shouldOfferGameRecommendation(result.level, totalScore)
      if (shouldRecommendGame) {
        offerGameRecommendation()
      }
    }, 2000)
  }

  /**
   * 判断是否应该推荐放松游戏
   * 根据测试结果的风险等级和分数判断是否推荐游戏
   * @param {string} riskLevel - 风险等级
   * @param {number} score - 测试分数
   */
  const shouldOfferGameRecommendation = (riskLevel, score) => {
    // 如果已经推荐过游戏，不再推荐
    if (state.gameRecommended) {
      return false
    }
    
    // 判断是否为低风险用户（适合推荐放松游戏）
    const isLowRisk = riskLevel === 'minimal' || 
                     (riskLevel === 'mild' && score <= 7) // 轻度症状但分数较低
    
    return isLowRisk
  }

  /**
   * 通过QuickReply的方式询问用户是否想玩放松游戏
   */
  const offerGameRecommendation = () => {
    // 标记已推荐游戏
    dispatch({ type: 'MARK_GAME_RECOMMENDED' })
    
    // 延迟3秒后询问，让用户先消化测试结果
    setTimeout(() => {
      addMessageWithEmoji({
        type: 'bot',
        content: '你的心理状态看起来不错！我这里有一个轻松的小游戏，可以帮你进一步放松心情。 emoji:relax',
        sender: 'assistant'
      })
      
      // 再延迟1秒后发送快速回复选项
      setTimeout(() => {
        addMessage({
          type: 'bot',
          content: '',
          sender: 'assistant',
          isQuickReply: true,
          quickReplyData: {
            question: '你想尝试一下这个治愈系切水果游戏吗？',
            options: [
              { value: 'play_game', label: '好的，我想试试' },
              { value: 'no_game', label: '不了，继续聊天' }
            ],
            selectedOption: null,
            isGameOffer: true // 标识这是游戏推荐类型的快速回复
          }
        })
      }, 1000)
    }, 3000)
  }

  /**
   * 心理测试触发条件判断函数
   * 
   * 触发条件说明：
   * 1. 用户消息数量 >= 3 条
   * 2. 用户消息数量是5的倍数（即第5条、第10条、第15条...时触发）
   * 3. 尚未提供过测试邀请 (hasBeenOffered = false)
   * 4. 用户尚未完成过测试 (hasCompleted = false)
   * 
   * @returns {boolean} 是否应该提供心理测试邀请
   */
  const shouldOfferPsychologicalTest = () => {
    // 防止重复提供：如果已经提供过测试或用户已经完成测试，不再提供
    if (state.psychologicalTest.hasBeenOffered || state.psychologicalTest.hasCompleted) {
      return false
    }
    
    // 统计用户发送的消息数量（只计算用户消息，不包括AI回复）
    const userMessageCount = state.messages.filter(msg => msg.type === 'user').length
    
    // 触发条件：用户消息数>=3且是5的倍数时提供测试邀请
    // 例如：第5条、第10条、第15条用户消息后会触发心理测试邀请
    return userMessageCount >= 3 && userMessageCount % 5 === 0
  }

  /**
   * 提供心理测试邀请函数
   * 
   * 执行流程：
   * 1. 标记已提供测试邀请，防止重复触发
   * 2. 延迟2秒发送介绍消息
   * 3. 再延迟1秒发送快速回复选项（是/否）
   * 
   * 用户选择后的处理逻辑在 handleQuickReply 函数中
   */
  const offerPsychologicalTest = () => {
    // 标记已提供测试邀请，防止重复触发
    dispatch({ type: 'MARK_TEST_OFFERED' })
    
    // 延迟2秒后发送测试介绍消息
    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: '基于我们的对话，我想你可能会对一个简短的心理健康评估感兴趣。这可以帮助我更好地了解你的感受，为你提供更准确的支持。',
        sender: 'assistant'
      })
      
      // 再延迟1秒后发送快速回复选项
      setTimeout(() => {
        addMessage({
          type: 'bot',
          content: '', // 空内容，因为这是纯快速回复消息
          sender: 'assistant',
          isQuickReply: true, // 标识这是快速回复消息
          quickReplyData: {
            question: '你是否愿意进行这个心理健康评估？',
            options: [
              { value: 'yes', label: '是的，我愿意' },  // 选择此项会启动心理测试
              { value: 'no', label: '不，谢谢' }       // 选择此项会礼貌拒绝
            ],
            selectedOption: null, // 初始状态未选择
            isTestOffer: true     // 标识这是测试邀请类型的快速回复
          }
        })
      }, 1000)
    }, 2000)
  }

  const updateUserProfile = (profileData) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: profileData })
  }

  const addConversationData = (type, data) => {
    dispatch({ type: 'ADD_CONVERSATION_DATA', payload: { type, data } })
  }

  /**
   * 健康相关关键词检测
   * 检测用户消息中是否包含健康症状相关的关键词
   * @param {string} message - 用户消息内容
   * @returns {Array} 匹配的关键词列表
   */
  const detectHealthKeywords = (message) => {
    const healthKeywords = [
      '心跳加快', '心慌', '心悸', '心律不齐',
      '睡得不好', '失眠', '睡眠不足', '睡不着', '入睡困难',
      '血压高', '血压低', '高血压', '低血压',
      '头晕', '头痛', '乏力', '疲劳',
      '呼吸急促', '胸闷', '气短',
      '手抖', '发抖', '颤抖',
      '出汗', '盗汗', '冷汗',
      '体温', '发烧', '发热'
    ]
    
    return healthKeywords.filter(keyword => message.includes(keyword))
  }

  /**
   * 请求穿戴数据
   * 当检测到健康关键词时触发此函数
   * @param {Array} keywords - 触发的关键词列表
   */
  const requestWearableData = (keywords) => {
    // 如果已经请求过穿戴数据，不再重复请求
    if (state.wearableDataRequest.hasBeenRequested) {
      return
    }
    
    dispatch({ 
      type: 'REQUEST_WEARABLE_DATA', 
      payload: { keywords } 
    })
  }

  /**
   * 提交穿戴数据
   * @param {Object} data - 穿戴数据
   */
  const submitWearableData = (data) => {
    dispatch({ 
      type: 'SUBMIT_WEARABLE_DATA', 
      payload: { data } 
    })
    
    // 发送一条确认消息
    addMessageWithEmoji({
      type: 'bot',
      content: '谢谢你提供的健康数据！这些信息将帮助我更好地了解你的身体状况，为你提供更准确的建议。 emoji:caring',
      sender: 'assistant'
    })
  }

  /**
   * 关闭穿戴数据请求
   */
  const closeWearableDataRequest = () => {
    dispatch({ type: 'CLOSE_WEARABLE_DATA_REQUEST' })
  }

  const exportUserData = () => {
    // 导出用户数据供后端处理
    const exportData = {
      sessionId: state.sessionId,
      timestamp: new Date().toISOString(),
      userProfile: state.userProfile,
      messages: state.messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp,
        metadata: msg.metadata
      })),
      riskLevel: state.userRiskLevel,
      userInfo: state.userInfo,
      wearableData: state.wearableDataRequest.data
    }
    
    // 可以发送到后端API或下载为JSON文件
    return exportData
  }

  const handleQuickReply = (messageId, value, label) => {
    // 获取当前快速回答消息
    const currentQuickReplyMsg = state.messages.find(msg => msg.id === messageId)
    
    // 更新快速回答消息，显示用户选择
    updateQuickReplyMessage(messageId, { value, label })
    
    // 发送用户选择的消息
    addMessage({
      type: 'user',
      content: label,
      sender: 'user'
    })
    
    // 处理心理测试相关的回答
    if (currentQuickReplyMsg?.quickReplyData?.isTestOffer) {
      // 处理测试邀请的回答
      if (value === 'yes') {
        startPsychologicalTest()
      } else {
        addMessage({
          type: 'bot',
          content: '没关系，如果你以后想要进行评估，随时告诉我。我们可以继续聊聊你的感受。',
          sender: 'assistant'
        })
      }
      return
    }
    
    // 处理游戏推荐的回答
    if (currentQuickReplyMsg?.quickReplyData?.isGameOffer) {
      if (value === 'play_game') {
        // 用户选择玩游戏，发送游戏卡片消息
        setTimeout(() => {
          addMessage({
            type: 'bot',
            content: '太棒了！这是一个轻松治愈的切水果游戏，点击下方卡片即可开始：',
            sender: 'assistant'
          })
          
          // 延迟1秒后发送游戏卡片消息
          setTimeout(() => {
            addMessage({
              type: 'bot',
              content: '',
              sender: 'assistant',
              isGameCard: true
            })
          }, 1000)
        }, 500)
      } else {
        // 用户选择不玩游戏
        setTimeout(() => {
          addMessage({
            type: 'bot',
            content: '没关系，我们继续聊天吧。如果之后想要放松一下，随时告诉我 🤗',
            sender: 'assistant'
          })
        }, 500)
      }
      return
    }
    
    if (currentQuickReplyMsg?.quickReplyData?.isTestQuestion) {
      // 处理测试题目的回答
      const questionIndex = currentQuickReplyMsg.quickReplyData.questionIndex
      const selectedOption = currentQuickReplyMsg.quickReplyData.options.find(opt => opt.value === value)
      answerTestQuestion(questionIndex, selectedOption)
      return
    }
    
    // 原有的逻辑处理
    // 更新用户档案
    if (value === 'yes' || value === 'no') {
      updateUserProfile({ isForSelf: value === 'yes' })
    } else if (value === 'diagnosed' || value === 'suspected') {
      updateUserProfile({ condition: value })
    } else if (value === 'yes_symptoms' || value === 'no_symptoms') {
      updateUserProfile({ symptoms: value === 'yes_symptoms' })
    }
    
    // 记录对话数据
    addConversationData('keywordMatches', {
      question: currentQuickReplyMsg?.quickReplyData?.question,
      answer: label,
      value: value,
      timestamp: new Date()
    })
    
    // 根据选择显示下一个问题或处理逻辑
    setTimeout(() => {
      if (value === 'yes') {
        addMessage({
          type: 'bot',
          content: '好的，感谢你的坦诚。',
          sender: 'assistant'
        })
        
        // 添加新的快速回答消息
        setTimeout(() => {
          addMessage({
            type: 'bot',
            content: '',
            sender: 'assistant',
            isQuickReply: true,
            quickReplyData: {
              question: '是确诊抑郁症了还是怀疑呢',
              options: [
                { value: 'diagnosed', label: '确诊抑郁症' },
                { value: 'suspected', label: '怀疑抑郁症' }
              ],
              selectedOption: null
            }
          })
        }, 500)
      } else if (value === 'no') {
        // 为他人咨询的情况
        addMessage({
          type: 'bot',
          content: '我理解你对他人的关心。无论是为自己还是他人寻求帮助，都是很有意义的。请告诉我具体的情况。',
          sender: 'assistant'
        })
      } else if (value === 'diagnosed' || value === 'suspected') {
        addMessage({
          type: 'bot',
          content: '我明白了。现在让我了解一下你的具体感受。',
          sender: 'assistant'
        })
        
        // 添加新的快速回答消息
        setTimeout(() => {
          addMessage({
            type: 'bot',
            content: '',
            sender: 'assistant',
            isQuickReply: true,
            quickReplyData: {
              question: '是出现情绪低落悲观消极开心不起来的事情吗？',
              options: [
                { value: 'yes_symptoms', label: '是' },
                { value: 'no_symptoms', label: '不是' }
              ],
              selectedOption: null
            }
          })
        }, 500)
      } else if (value === 'yes_symptoms' || value === 'no_symptoms') {
        // 结束快速问答，进入自由对话
        addMessage({
          type: 'bot',
          content: '谢谢你的回答，这些信息对我了解你的情况很有帮助。现在你可以自由地和我分享你的感受，我会认真倾听。',
          sender: 'assistant'
        })
      }
    }, 1000)
  }

  const sendMessage = async (content) => {
    addMessage({
      type: 'user',
      content,
      sender: 'user'
    })

    // 【表情包测试功能】检查完整的测试指令
    const testEmojiMatch = content.match(/^测试表情包[\s:]*(comfort|encourage|caring|relax|greeting|hug|youaregreat|heart|laugh|ok|playwithyou|workout|goodnight|feelingsad|terrified|angry|exhausted|confused|eating|byebye)$/i)
    if (testEmojiMatch) {
      const category = testEmojiMatch[1].toLowerCase()
      setTimeout(() => {
        addMessageWithEmoji({
          type: 'bot',
          content: `这是${category}类别的表情包测试 emoji:${category}`,
          sender: 'assistant'
        })
      }, 1000)
      return
    }

    // 【简化测试指令】- 支持所有20个分类
    const simpleTestMatch = content.match(/^(安慰|鼓励|关爱|放松|问候|拥抱|很棒|爱心|笑|好的|游戏|运动|晚安|难过|恐惧|愤怒|疲惫|困惑|吃饭|再见)$/i)
    if (simpleTestMatch) {
      const categoryMap = {
        '安慰': 'comfort', '鼓励': 'encourage', '关爱': 'caring', '放松': 'relax', '问候': 'greeting',
        '拥抱': 'hug', '很棒': 'youaregreat', '爱心': 'heart', '笑': 'laugh', '好的': 'ok',
        '游戏': 'playwithyou', '运动': 'workout', '晚安': 'goodnight', '难过': 'feelingsad', 
        '恐惧': 'terrified', '愤怒': 'angry', '疲惫': 'exhausted', '困惑': 'confused', 
        '吃饭': 'eating', '再见': 'byebye'
      }
      const category = categoryMap[simpleTestMatch[1]]
      if (category) {
        setTimeout(() => {
          addMessageWithEmoji({
            type: 'bot',
            content: `收到！发送${simpleTestMatch[1]}类表情包 emoji:${category}`,
            sender: 'assistant'
          })
        }, 1000)
        return
      }
    }

    setTyping(true)
    
    // 【健康关键词检测】检测用户消息中是否包含健康相关关键词
    const healthKeywords = detectHealthKeywords(content)
    if (healthKeywords.length > 0 && !state.wearableDataRequest.hasBeenRequested) {
      // 检测到健康关键词且尚未请求过穿戴数据，触发请求
      requestWearableData(healthKeywords)
    }
    
    // 【心理测试触发点】在发送用户消息后检查是否应该提供心理测试
    // 这里会根据用户消息数量和其他条件判断是否触发测试邀请
    const shouldOffer = shouldOfferPsychologicalTest()
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: content,
          sessionId: state.sessionId,
          riskLevel: state.userRiskLevel,
          userInfo: state.userInfo,
          psychologicalTest: state.psychologicalTest
        })
      })

      const data = await response.json()
      
      setTimeout(() => {
        setTyping(false)
        addMessageWithEmoji({
          type: 'bot',
          content: data.message,
          sender: 'assistant',
          metadata: data.metadata
        })

        if (data.riskLevel && data.riskLevel !== state.userRiskLevel) {
          updateRiskLevel(data.riskLevel)
        }

        if (data.userInfo) {
          updateUserInfo(data.userInfo)
        }
        
        // 【心理测试触发执行】在AI回答完成后，如果满足触发条件则提供心理测试邀请
        if (shouldOffer) {
          offerPsychologicalTest() // 执行测试邀请流程
        }
      }, 1500 + Math.random() * 1000)

    } catch (error) {
      setTyping(false)
      console.error('发送消息失败:', error)
      
      setTimeout(() => {
        addMessageWithEmoji({
          type: 'bot',
          content: '抱歉，我现在遇到了一些技术问题。如果你正处于紧急情况，请立即拨打危机热线：400-161-9995 emoji:caring',
          sender: 'assistant'
        })
        
        // 【错误处理】即使API调用出错，也要检查是否提供心理测试
        // 确保心理测试功能不会因为网络问题而失效
        if (shouldOffer) {
          offerPsychologicalTest() // 执行测试邀请流程
        }
      }, 1000)
    }
  }

  /**
   * 测试表情包发送的辅助函数
   * @param {string} category - 表情包类别 comfort|encourage|caring|relax|greeting
   */
  const testEmoji = (category) => {
    const emojiPath = getEmojiByInstruction(`emoji:${category}`)
    if (emojiPath) {
      const emojiMessage = createEmojiMessage(emojiPath)
      if (emojiMessage) {
        addMessage({
          ...emojiMessage,
          id: uuidv4()
        })
      }
    }
  }

  const value = {
    ...state,
    addMessage,
    addMessageWithEmoji,
    setTyping,
    updateRiskLevel,
    updateUserInfo,
    toggleService,
    clearChat,
    sendMessage,
    handleQuickReply,
    updateUserProfile,
    addConversationData,
    exportUserData,
    updateQuickReplyMessage,
    testEmoji, // 添加测试函数
    // 心理测试相关函数
    startPsychologicalTest,
    answerTestQuestion,
    completePsychologicalTest,
    shouldOfferPsychologicalTest,
    offerPsychologicalTest,
    determineTestType,
    getTestQuestions,
    // 游戏推荐相关函数
    shouldOfferGameRecommendation,
    offerGameRecommendation,
    // 穿戴数据相关函数
    detectHealthKeywords,
    requestWearableData,
    submitWearableData,
    closeWearableDataRequest
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}