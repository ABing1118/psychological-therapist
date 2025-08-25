import { useState, useEffect, useCallback } from 'react'
import demoScript from '../data/demo-script.json'
import { v4 as uuidv4 } from 'uuid'

export const useDemoScript = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isWaitingForInput, setIsWaitingForInput] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [executedResponses, setExecutedResponses] = useState([])
  const [psychologicalTestExecuted, setPsychologicalTestExecuted] = useState(false)

  const conversations = demoScript.demo_script.conversations
  const config = demoScript.demo_config

  // 启动Demo模式
  const startDemo = useCallback(() => {
    setIsDemoMode(true)
    setCurrentStep(0)
    setIsWaitingForInput(true)
    setExecutedResponses([])
    setPsychologicalTestExecuted(false)
  }, [])

  // 停止Demo模式
  const stopDemo = useCallback(() => {
    setIsDemoMode(false)
    setCurrentStep(0)
    setIsWaitingForInput(true)
    setExecutedResponses([])
    setPsychologicalTestExecuted(false)
  }, [])

  // 重置Demo
  const resetDemo = useCallback(() => {
    setCurrentStep(0)
    setIsWaitingForInput(true)
    setExecutedResponses([])
    setPsychologicalTestExecuted(false)
  }, [])

  // 检查是否处于心理测试完成状态
  const checkPsychologicalTestStatus = useCallback((psychologicalTestState) => {
    if (!isDemoMode) return null
    
    // 只检查测试完成状态，查找step_8并且防止重复执行
    if (psychologicalTestState.isCompleted && !psychologicalTestExecuted) {
      setPsychologicalTestExecuted(true) // 标记已执行
      
      // 找到step_8对应的对话
      const step8Conversation = conversations.find(conv => conv.id === 'step_8')
      if (step8Conversation) {
        console.log('Found step_8 conversation, will execute and then jump to step_9')
        
        // 直接找到step_9的索引并设置为当前步骤，这样AI回复执行完后就是step_9
        const step9Index = conversations.findIndex(conv => conv.id === 'step_9')
        if (step9Index !== -1) {
          console.log('Pre-setting current step to step_9 index:', step9Index)
          // 设置步骤到step_9的前一步，这样executeAIResponses完成后会正确推进到step_9
          setCurrentStep(step9Index - 1)
        }
        
        return step8Conversation
      }
    }
    
    return null
  }, [isDemoMode, conversations, psychologicalTestExecuted])

  // 匹配用户输入
  const matchUserInput = useCallback((userInput) => {
    if (!isDemoMode || currentStep >= conversations.length) {
      return null
    }

    const conversation = conversations[currentStep]
    
    // 检查是否是心理测试特殊状态
    if (conversation.user_input === 'psychological_test_in_progress' || 
        conversation.user_input === 'psychological_test_completed') {
      return null // 这些状态需要通过 checkPsychologicalTestStatus 来处理
    }
    
    // 严格匹配或模糊匹配
    const normalizeInput = (str) => str.toLowerCase().trim().replace(/[，。！？\s]/g, '')
    const userNormalized = normalizeInput(userInput)
    const expectedNormalized = normalizeInput(conversation.user_input)
    
    // 严格模式下完全匹配，否则包含匹配
    if (config.strict_mode) {
      if (userNormalized === expectedNormalized) {
        return conversation
      }
    } else {
      if (userNormalized.includes(expectedNormalized) || expectedNormalized.includes(userNormalized)) {
        return conversation
      }
    }
    
    return null
  }, [isDemoMode, currentStep, conversations, config.strict_mode])

  // 获取当前期望的用户输入
  const getCurrentExpectedInput = useCallback(() => {
    if (!isDemoMode || currentStep >= conversations.length) {
      return null
    }
    return conversations[currentStep].user_input
  }, [isDemoMode, currentStep, conversations])

  // 获取所有步骤的用户输入（用于提示）
  const getAllExpectedInputs = useCallback(() => {
    return conversations.map((conv, index) => ({
      step: index + 1,
      input: conv.user_input
    }))
  }, [conversations])

  // 执行AI回复
  const executeAIResponses = useCallback((conversation, onExecuteAction) => {
    if (!conversation || !conversation.ai_responses) {
      return Promise.resolve()
    }

    setIsWaitingForInput(false)
    
    // 使用串行执行而不是并行，确保每条消息都有独立的生成状态
    const executeResponsesSequentially = async () => {
      for (let index = 0; index < conversation.ai_responses.length; index++) {
        const response = conversation.ai_responses[index]
        
        await new Promise((resolve) => {
          setTimeout(() => {
            // 创建消息对象
            const messageId = uuidv4()
            const message = {
              id: messageId,
              type: 'bot',
              content: response.content,
              sender: 'assistant',
              timestamp: Date.now(),
              character_state: response.character_state,
              emoji: response.emoji,
              actions: response.actions,
              isMultipleResponse: conversation.ai_responses.length > 1, // 标记是否为多条回复
              responseIndex: index, // 回复索引
              totalResponses: conversation.ai_responses.length // 总回复数
            }

            // 标记为已执行
            setExecutedResponses(prev => [...prev, messageId])
            
            // 执行回调
            if (onExecuteAction) {
              onExecuteAction(message)
            }
            
            resolve(message)
          }, response.delay || 0)
        })
      }
    }

    return executeResponsesSequentially().then(() => {
      // 所有回复执行完毕，进入下一步
      // 特殊处理：如果当前是step_8（心理测试完成），需要跳转到step_9
      if (conversation.id === 'step_8') {
        // 找到step_9在conversations数组中的索引
        const step9Index = conversations.findIndex(conv => conv.id === 'step_9')
        if (step9Index !== -1) {
          console.log('Special case: step_8 completed, jumping to step_9 at index:', step9Index)
          setCurrentStep(step9Index)
        } else {
          setCurrentStep(prev => prev + 1)
        }
      } else {
        setCurrentStep(prev => prev + 1)
      }
      setIsWaitingForInput(true)
    })
  }, [])

  // 处理用户输入
  const handleUserInput = useCallback((userInput, onExecuteAction) => {
    console.log('useDemoScript: handleUserInput called', { 
      userInput, 
      isDemoMode, 
      isWaitingForInput, 
      currentStep,
      totalConversations: conversations.length
    })
    
    if (!isDemoMode || !isWaitingForInput) {
      console.log('useDemoScript: Not in demo mode or not waiting for input')
      return Promise.resolve({ matched: false, conversation: null })
    }

    const matchedConversation = matchUserInput(userInput)
    console.log('useDemoScript: matchedConversation', matchedConversation)
    
    if (matchedConversation) {
      console.log('useDemoScript: Executing AI responses')
      return executeAIResponses(matchedConversation, onExecuteAction)
        .then(() => {
          console.log('useDemoScript: AI responses executed successfully')
          return { matched: true, conversation: matchedConversation }
        })
        .catch(error => {
          console.error('useDemoScript: Error executing AI responses:', error)
          return { matched: false, conversation: null }
        })
    }
    
    console.log('useDemoScript: No conversation matched')
    return Promise.resolve({ matched: false, conversation: null })
  }, [isDemoMode, isWaitingForInput, matchUserInput, executeAIResponses, currentStep, conversations.length])

  // 获取Demo进度
  const getDemoProgress = useCallback(() => {
    return {
      currentStep: currentStep + 1,
      totalSteps: conversations.length,
      progress: ((currentStep) / conversations.length) * 100,
      isComplete: currentStep >= conversations.length,
      isWaiting: isWaitingForInput
    }
  }, [currentStep, conversations.length, isWaitingForInput])

  // 检查是否是Demo模式
  const checkIsDemoMode = useCallback(() => {
    return isDemoMode
  }, [isDemoMode])

  // 获取Demo配置
  const getDemoConfig = useCallback(() => {
    return config
  }, [config])


  return {
    // 状态
    isDemoMode,
    currentStep,
    isWaitingForInput,
    
    // 控制方法
    startDemo,
    stopDemo,
    resetDemo,
    
    // 输入处理
    handleUserInput,
    matchUserInput,
    checkPsychologicalTestStatus,
    executeAIResponses,
    getCurrentExpectedInput,
    getAllExpectedInputs,
    
    // 进度信息
    getDemoProgress,
    
    // 配置
    getDemoConfig,
    checkIsDemoMode
  }
}