import React, { createContext, useContext, useState, useEffect } from 'react'

const CharacterContext = createContext()

// 人物状态配置
export const characterStates = {
  general: {
    name: '默认状态',
    image: '/character/general.png',
    description: '正在等待与你的对话',
    mood: 'neutral',
    animation: 'idle'
  },
  greeting: {
    name: '问候状态', 
    image: '/character/greeting.png',
    description: '很高兴见到你！',
    mood: 'happy',
    animation: 'wave'
  },
  listening: {
    name: '倾听状态',
    image: '/character/listening.png', 
    description: '我在认真倾听你的话',
    mood: 'focused',
    animation: 'listen'
  },
  encourage: {
    name: '鼓励状态',
    image: '/character/encourage.png',
    description: '你做得很棒，继续努力！',
    mood: 'supportive',
    animation: 'cheer'
  },
  great: {
    name: '赞扬状态',
    image: '/character/great.png', 
    description: '太棒了！我为你感到骄傲',
    mood: 'proud',
    animation: 'applause'
  },
  clapping: {
    name: '庆祝状态',
    image: '/character/clapping.png',
    description: '恭喜你完成了这个重要步骤！',
    mood: 'celebratory',
    animation: 'clap'
  },
  relaxing: {
    name: '放松状态',
    image: '/character/relaxing.png',
    description: '让我们一起放松身心',
    mood: 'calm',
    animation: 'meditate'
  },
  tips: {
    name: '提示状态',
    image: '/character/tips.png',
    description: '我给你一些建议',
    mood: 'tips',
    animation: 'tips'
  }
}

export const CharacterProvider = ({ children }) => {
  // 当前人物状态
  const [currentState, setCurrentState] = useState('greeting')
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // 状态切换历史
  const [stateHistory, setStateHistory] = useState(['greeting'])
  
  // 自动返回默认状态的计时器
  const [autoResetTimer, setAutoResetTimer] = useState(null)

  // 切换人物状态
  const changeState = (newState, duration = 5000) => {
    console.log('changeState called:', { currentState, newState, duration })
    
    if (!characterStates[newState]) {
      console.warn(`无效的人物状态: ${newState}`)
      return
    }

    if (currentState === newState) {
      console.log('State unchanged, same as current state')
      return
    }

    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentState(newState)
      setStateHistory(prev => [...prev.slice(-4), newState]) // 保留最近5个状态
      setIsTransitioning(false)
    }, 300) // 过渡动画时间

    // 清除之前的计时器
    if (autoResetTimer) {
      clearTimeout(autoResetTimer)
    }

    // 禁用自动返回计时器功能 - 保持状态直到明确改变
    // if (newState !== 'general' && duration > 0) {
    //   const timer = setTimeout(() => {
    //     changeState('general', 0) // 0表示不再设置新的计时器
    //   }, duration)
    //   setAutoResetTimer(timer)
    // }
  }

  // 根据情绪智能切换状态
  const changeStateByMood = (mood, context = '') => {
    const moodStateMap = {
      'happy': 'greeting',
      'sad': 'listening', 
      'excited': 'clapping',
      'calm': 'relaxing',
      'proud': 'great',
      'supportive': 'encourage',
      'listening': 'listening',
      'celebrating': 'clapping',
      'tips': 'tips'
    }

    const targetState = moodStateMap[mood] || 'general'
    changeState(targetState)
  }

  // 从AI回复中提取action指令
  const processActionInstruction = (content) => {
    const actionRegex = /action:(\w+)/gi
    const matches = content.match(actionRegex)
    
    if (matches) {
      // 取第一个action指令
      const actionMatch = matches[0].match(/action:(\w+)/i)
      if (actionMatch) {
        const actionState = actionMatch[1].toLowerCase()
        changeState(actionState)
        return true
      }
    }
    return false
  }

  // 获取当前状态信息
  const getCurrentStateInfo = () => {
    return {
      ...characterStates[currentState],
      state: currentState,
      isTransitioning,
      history: stateHistory
    }
  }

  // 随机状态切换（用于测试）
  const randomState = () => {
    const states = Object.keys(characterStates)
    const randomIndex = Math.floor(Math.random() * states.length)
    const randomStateName = states[randomIndex]
    changeState(randomStateName)
  }

  // 清理计时器
  useEffect(() => {
    return () => {
      if (autoResetTimer) {
        clearTimeout(autoResetTimer)
      }
    }
  }, [autoResetTimer])

  const value = {
    currentState,
    characterStates,
    isTransitioning,
    stateHistory,
    changeState,
    changeStateByMood,
    processActionInstruction,
    getCurrentStateInfo,
    randomState
  }

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  )
}

export const useCharacter = () => {
  const context = useContext(CharacterContext)
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider')
  }
  return context
}