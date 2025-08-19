import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const ChatContext = createContext()

const initialState = {
  messages: [],
  isTyping: false,
  sessionId: null,
  userRiskLevel: 'unknown', // unknown, low, medium, high, critical
  userInfo: {
    hasSharedEmotions: false,
    hasExpressedSuicidalThoughts: false,
    conversationDepth: 0
  },
  services: {
    emergency: false,
    counseling: false,
    games: false,
    assessment: false
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
    
    case 'CLEAR_CHAT':
      return {
        ...initialState,
        sessionId: uuidv4()
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

  const sendMessage = async (content) => {
    addMessage({
      type: 'user',
      content,
      sender: 'user'
    })

    setTyping(true)
    
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
          userInfo: state.userInfo
        })
      })

      const data = await response.json()
      
      setTimeout(() => {
        setTyping(false)
        addMessage({
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
      }, 1500 + Math.random() * 1000)

    } catch (error) {
      setTyping(false)
      console.error('发送消息失败:', error)
      
      setTimeout(() => {
        addMessage({
          type: 'bot',
          content: '抱歉，我现在遇到了一些技术问题。如果你正处于紧急情况，请立即拨打危机热线：400-161-9995',
          sender: 'assistant'
        })
      }, 1000)
    }
  }

  const value = {
    ...state,
    addMessage,
    setTyping,
    updateRiskLevel,
    updateUserInfo,
    toggleService,
    clearChat,
    sendMessage
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