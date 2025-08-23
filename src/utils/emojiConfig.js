/**
 * 表情包配置系统 - 全新的20分类体系
 * 总计108个表情包文件，支持心理治疗场景的全面情感表达
 */

export const emojiCategories = {
  // ============ 正面情感类别 ============
  
  // 安慰类 - 用于理解、倾听、同情场景 (16个文件)
  comfort: {
    path: '/emojis/comfort',
    emojis: [
      'Soft and Cute Chick 4 (Animation) _ Line Sticker.gif',
      'comfort-1.gif', 'comfort-2.gif', 'comfort-3.gif', 'comfort-4.gif',
      'comfort-5.gif', 'comfort-6.gif', 'comfort-7.gif', 'comfort-9.gif',
      'comfort-10.gif', 'comfort-11.gif', 'daily-penguin-2.gif',
      'gentle-penguin.gif', 'love-hearts.gif', 'pet-dog.gif', 'warm-penguin-2.gif'
    ],
    description: '提供温暖安慰和理解的表情包',
    contexts: ['安慰', '理解', '倾听', '同情', '抑郁', '焦虑', '难过', '痛苦', '支持'],
    weight: 0.9,
    emotionType: 'positive'
  },
  
  // 鼓励类 - 用于加油、进步、完成任务场景 (8个文件)
  encourage: {
    path: '/emojis/encourage',
    emojis: [
      'comfort-7.gif', 'cute-chick.gif', 'encourage-1.jpg', 'encourage-2.gif',
      'good-job-tea.gif', 'happy-dog.gif', 'spring-penguin-1.gif', 'spring-scene.gif'
    ],
    description: '鼓励和赞扬的表情包',
    contexts: ['鼓励', '加油', '坚持', '进步', '勇敢', '辛苦了', '做得好', '继续'],
    weight: 0.8,
    emotionType: 'positive'
  },

  // 拥抱类 - 用于深度安慰和支持场景 (7个文件)
  hug: {
    path: '/emojis/hug',
    emojis: [
      'hug-1.jpeg', 'hug-2.jpg', 'hug-3.gif', 'hug-4.gif',
      'hug-5.jpg', 'hug-6.gif', 'hug-7.gif'
    ],
    description: '拥抱和深度安慰的表情包',
    contexts: ['拥抱', '安慰', '支持', '陪伴', '温暖', '不孤单', '在身边'],
    weight: 0.7,
    emotionType: 'positive'
  },

  // 放松类 - 用于休息、冥想、游戏场景 (8个文件)
  relax: {
    path: '/emojis/relax',
    emojis: [
      'daily-penguin-1.gif', 'hot-spring.gif', 'relax-1.gif', 'relax-2.gif',
      'relax-3.gif', 'rest-well-cats.gif', 'spring-penguin-2.gif', 'warm-penguin-1.gif'
    ],
    description: '帮助放松和休息的表情包',
    contexts: ['放松', '休息', '冥想', '治愈', '缓解', '泡温泉', '睡觉'],
    weight: 0.6,
    emotionType: 'positive'
  },

  // 称赞类 - 用于肯定和赞美场景 (6个文件)
  youaregreat: {
    path: '/emojis/youaregreat',
    emojis: [
      'great-1.gif', 'great-2.gif', 'great-3.jpeg',
      'great-4.gif', 'great-5.jpeg', 'great-6.gif'
    ],
    description: '称赞和肯定的表情包',
    contexts: ['很棒', '厉害', '优秀', '赞', '好样的', '了不起', '真棒'],
    weight: 0.7,
    emotionType: 'positive'
  },

  // 爱心类 - 用于表达爱和温暖 (5个文件)
  heart: {
    path: '/emojis/heart',
    emojis: ['heart-1.gif', 'heart-2.gif', 'heart-3.gif', 'heart-4.gif', 'heart-5.gif'],
    description: '爱心和温暖的表情包',
    contexts: ['爱', '心', '温暖', '喜欢', '关心', '心疼', '爱心'],
    weight: 0.6,
    emotionType: 'positive'
  },

  // 笑类 - 用于开心和幽默场景 (3个文件)  
  laugh: {
    path: '/emojis/laugh',
    emojis: ['laugh-1.gif', 'laugh-2.gif', 'laugh-3.gif'],
    description: '开心和快乐的表情包',
    contexts: ['笑', '哈哈', '开心', '快乐', '幽默', '有趣', '好笑'],
    weight: 0.8,
    emotionType: 'positive'
  },

  // 确认类 - 用于同意和认可 (5个文件)
  ok: {
    path: '/emojis/ok',
    emojis: ['ok-1.gif', 'ok-2.gif', 'ok-3.gif', 'ok-4.gif', 'ok-5.gif'],
    description: '同意和确认的表情包',
    contexts: ['好的', '行', '可以', '同意', '没问题', 'ok', '赞同'],
    weight: 0.5,
    emotionType: 'positive'
  },

  // 游戏类 - 用于娱乐和互动 (6个文件)
  playwithyou: {
    path: '/emojis/playwithyou',
    emojis: [
      'play-1.gif', 'play-2.gif', 'play-3.gif',
      'play-4.gif', 'play-5.gif', 'play-6.gif'
    ],
    description: '游戏和娱乐的表情包',
    contexts: ['玩', '游戏', '娱乐', '一起', '互动', '有趣', '放松一下'],
    weight: 0.4,
    emotionType: 'positive'
  },

  // 运动类 - 用于健康和活力场景 (7个文件)
  workout: {
    path: '/emojis/workout',
    emojis: [
      'workout-1.gif', 'workout-2.gif', 'workout-3.jpeg', 'workout-4.jpeg',
      'workout-5.jpeg', 'workout-6.jpeg', 'workout-7.jpeg'
    ],
    description: '运动和健康的表情包',
    contexts: ['运动', '锻炼', '健身', '活力', '健康', '跑步', '瑜伽'],
    weight: 0.3,
    emotionType: 'positive'
  },

  // 关爱类 - 用于关心问候 (1个文件)
  caring: {
    path: '/emojis/caring',
    emojis: ['are-you-ok.gif'],
    description: '关心和问候的表情包',
    contexts: ['关心', '关爱', '还好吗', '担心', '牵挂', '照顾'],
    weight: 0.8,
    emotionType: 'positive'
  },

  // 问候类 - 用于打招呼 (6个文件)
  greeting: {
    path: '/emojis/greeting',
    emojis: [
      'hello-1.jpg', 'hello-2.jpeg', 'hello-3.gif',
      'hello-4.gif', 'hello-5.gif', 'hello-6.gif'
    ],
    description: '问候和打招呼的表情包',
    contexts: ['你好', '打招呼', '问候', '早上好', '开始对话', 'hi', 'hello'],
    weight: 0.4,
    emotionType: 'positive'
  },

  // 晚安类 - 用于睡前和结束 (6个文件)
  goodnight: {
    path: '/emojis/goodnight',
    emojis: [
      'goodnight-1.gif', 'goodnight-2.gif', 'goodnight-3.gif',
      'goodnight-4.gif', 'goodnight-5.gif', 'goodnight-6.gif'
    ],
    description: '晚安和睡前的表情包',
    contexts: ['晚安', '睡觉', '休息', '结束', '明天见', '好梦'],
    weight: 0.5,
    emotionType: 'positive'
  },

  // ============ 负面情感类别 ============

  // 难过类 - 用于悲伤和沮丧场景 (8个文件)
  feelingsad: {
    path: '/emojis/feelingsad',
    emojis: [
      'sad-1.gif', 'sad-2.jpeg', 'sad-3.gif', 'sad-4.gif',
      'sad-5.gif', 'sad-6.gif', 'sad-7.jpeg', 'sad-8.gif'
    ],
    description: '理解悲伤情绪的表情包',
    contexts: ['难过', '伤心', '哭', '悲伤', '沮丧', '痛苦', '委屈'],
    weight: 0.7,
    emotionType: 'negative'
  },

  // 恐惧类 - 用于害怕和恐惧场景 (3个文件)
  terrified: {
    path: '/emojis/terrified',
    emojis: ['terrified-1.gif', 'terrified-2.gif', 'terrified-3.gif'],
    description: '理解恐惧情绪的表情包',
    contexts: ['害怕', '恐惧', '担心', '紧张', '焦虑', '不安'],
    weight: 0.6,
    emotionType: 'negative'
  },

  // 愤怒类 - 用于愤怒场景 (1个文件)
  angry: {
    path: '/emojis/angry',
    emojis: ['angry-1.gif'],
    description: '理解愤怒情绪的表情包',
    contexts: ['生气', '愤怒', '烦躁', '不爽', '气愤'],
    weight: 0.5,
    emotionType: 'negative'
  },

  // 疲惫类 - 用于疲劳和无力场景 (2个文件)
  exhausted: {
    path: '/emojis/exhausted',
    emojis: ['exhausted-1.gif', 'exhausted-2.gif'],
    description: '理解疲惫状态的表情包',
    contexts: ['累', '疲惫', '没力气', '疲劳', '无力', '筋疲力尽'],
    weight: 0.4,
    emotionType: 'negative'
  },

  // ============ 中性情感类别 ============

  // 困惑类 - 用于迷茫和不理解 (4个文件)
  confused: {
    path: '/emojis/confused',
    emojis: ['confused-1.gif', 'confused-2.gif', 'confused-3.gif', 'confused-4.jpg'],
    description: '表达困惑和迷茫的表情包',
    contexts: ['困惑', '不懂', '迷茫', '疑惑', '不理解', '什么意思'],
    weight: 0.3,
    emotionType: 'neutral'
  },

  // 吃饭类 - 用于日常生活场景 (4个文件)
  eating: {
    path: '/emojis/eating',
    emojis: ['eating-1.jpg', 'eating-2.gif', 'eating-3.gif', 'eating-4.gif'],
    description: '饮食和日常生活的表情包',
    contexts: ['吃饭', '饿', '美食', '吃', '好吃', '饮食'],
    weight: 0.2,
    emotionType: 'neutral'
  },

  // 再见类 - 用于告别场景 (2个文件)
  byebye: {
    path: '/emojis/byebye',
    emojis: ['bye-1.gif', 'bye-2.gif'],
    description: '告别和再见的表情包',
    contexts: ['再见', '拜拜', '告别', '结束', 'bye'],
    weight: 0.3,
    emotionType: 'neutral'
  }
}

/**
 * 根据模型指令获取表情包
 * @param {string} instruction - 模型指令，格式: "emoji:comfort" 或 "emoji:relax"
 * @returns {string|null} 表情包路径
 */
export function getEmojiByInstruction(instruction) {
  const match = instruction.match(/emoji:(\w+)/i)
  if (!match) return null
  
  const category = match[1].toLowerCase()
  const categoryConfig = emojiCategories[category]
  
  if (!categoryConfig || categoryConfig.emojis.length === 0) {
    return null
  }
  
  // 随机选择该类别中的一个表情包
  const randomEmoji = categoryConfig.emojis[
    Math.floor(Math.random() * categoryConfig.emojis.length)
  ]
  
  return `${categoryConfig.path}/${randomEmoji}`
}

/**
 * 根据消息内容智能选择表情包
 * @param {string} messageContent - 消息内容
 * @param {string} context - 对话上下文
 * @param {string} userRiskLevel - 用户风险等级
 * @returns {string|null} 表情包路径
 */
export function selectEmoji(messageContent, context = '', userRiskLevel = 'low') {
  // 基础概率 - 保持5%的低触发率
  const baseChance = 0.05
  
  if (Math.random() > baseChance) {
    return null
  }
  
  const message = messageContent.toLowerCase()
  const contextLower = context.toLowerCase()
  const allText = message + ' ' + contextLower
  
  // 计算各类别匹配分数
  const scores = {}
  
  Object.entries(emojiCategories).forEach(([category, config]) => {
    let score = 0
    
    // 基础权重
    score += config.weight
    
    // 关键词匹配加分
    config.contexts.forEach(keyword => {
      if (allText.includes(keyword)) {
        score += 0.4
      }
    })
    
    // 根据用户风险等级调整
    if (userRiskLevel === 'high' || userRiskLevel === 'critical') {
      // 高风险用户优先使用安慰、拥抱、关爱类
      if (['comfort', 'hug', 'caring', 'heart'].includes(category)) score += 0.5
    } else if (userRiskLevel === 'medium') {
      // 中风险用户平衡使用安慰和鼓励类
      if (['comfort', 'encourage', 'hug'].includes(category)) score += 0.3
    } else {
      // 低风险用户可以使用各类正面表情包
      if (config.emotionType === 'positive') score += 0.2
    }
    
    scores[category] = score
  })
  
  // 选择分数最高的类别
  const bestCategory = Object.entries(scores).reduce((max, [cat, score]) => 
    score > max.score ? { category: cat, score } : max
  , { category: null, score: 0 })
  
  if (!bestCategory.category || bestCategory.score < 0.4) {
    return null
  }
  
  return getEmojiByInstruction(`emoji:${bestCategory.category}`)
}

/**
 * 特定场景下强制显示表情包
 * @param {string} scenario - 场景类型
 * @returns {string|null} 表情包路径
 */
export function getScenarioEmoji(scenario) {
  const scenarioMap = {
    'welcome': () => getEmojiByInstruction('emoji:greeting'),
    'test_complete': () => getEmojiByInstruction('emoji:youaregreat'),
    'high_risk': () => getEmojiByInstruction('emoji:comfort'),
    'game_offer': () => getEmojiByInstruction('emoji:playwithyou'),
    'comfort_needed': () => getEmojiByInstruction('emoji:hug'),
    'caring': () => getEmojiByInstruction('emoji:caring'),
    'encourage': () => getEmojiByInstruction('emoji:encourage'),
    'goodnight': () => getEmojiByInstruction('emoji:goodnight'),
    'sad_response': () => getEmojiByInstruction('emoji:feelingsad'),
    'angry_response': () => getEmojiByInstruction('emoji:terrified'),
    'workout_suggest': () => getEmojiByInstruction('emoji:workout')
  }
  
  const result = scenarioMap[scenario]
  return typeof result === 'function' ? result() : result || null
}

/**
 * 创建表情包消息对象
 * @param {string} emojiPath - 表情包路径
 * @returns {Object} 消息对象
 */
export function createEmojiMessage(emojiPath) {
  if (!emojiPath) return null
  
  return {
    type: 'emoji',
    sender: 'assistant', 
    emoji: emojiPath,
    timestamp: new Date()
  }
}

/**
 * 从消息内容中提取并处理表情包指令
 * @param {string} content - 消息内容
 * @returns {Object} {cleanContent: string, emojiPath: string|null}
 */
export function extractEmojiInstruction(content) {
  const emojiRegex = /emoji:(\w+)/gi
  const matches = content.match(emojiRegex)
  
  if (!matches) {
    return { cleanContent: content, emojiPath: null }
  }
  
  // 移除表情包指令，获取纯净内容
  const cleanContent = content.replace(emojiRegex, '').trim()
  
  // 获取第一个表情包指令
  const emojiPath = getEmojiByInstruction(matches[0])
  
  return { cleanContent, emojiPath }
}

/**
 * 获取所有表情包类别信息
 * @returns {Array} 类别信息数组
 */
export function getAllEmojiCategories() {
  return Object.entries(emojiCategories).map(([key, config]) => ({
    key,
    name: key,
    description: config.description,
    count: config.emojis.length,
    emotionType: config.emotionType,
    weight: config.weight,
    contexts: config.contexts
  }))
}