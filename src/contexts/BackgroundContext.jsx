import React, { createContext, useContext, useState, useEffect } from 'react'

const BackgroundContext = createContext()

// 背景图片配置
export const backgroundImages = [
  {
    id: 1,
    name: '晨光公园',
    filename: 'morning_park.png',
    path: '/background/morning_park.png',
    time: 'morning',
    scene: 'park',
    mood: '清新自然',
    description: '清晨的公园，阳光透过树叶洒下斑驳光影'
  },
  {
    id: 2,
    name: '晨光校园',
    filename: 'morning_school.png',
    path: '/background/morning_school.png',
    time: 'morning',
    scene: 'school',
    mood: '青春活力',
    description: '晨曦中的校园，充满青春与希望的气息'
  },
  {
    id: 3,
    name: '午后公园',
    filename: 'afternoon_park.png',
    path: '/background/afternoon_park.png',
    time: 'afternoon',
    scene: 'park',
    mood: '温暖宁静',
    description: '午后的公园，温暖的阳光带来内心的平静'
  },
  {
    id: 4,
    name: '午后校园',
    filename: 'afternoon_school.png',
    path: '/background/afternoon_school.png',
    time: 'afternoon',
    scene: 'school',
    mood: '轻松舒适',
    description: '午后的校园时光，轻松惬意的学习氛围'
  },
  {
    id: 5,
    name: '夜晚道路',
    filename: 'night_road.jpg',
    path: '/background/night_road.jpg',
    time: 'night',
    scene: 'road',
    mood: '深邃思考',
    description: '夜晚的道路，适合深度思考和内心对话'
  },
  {
    id: 6,
    name: '夜晚街道',
    filename: 'night_street.png',
    path: '/background/night_street.png',
    time: 'night',
    scene: 'street',
    mood: '温馨陪伴',
    description: '夜晚的街道，温暖的灯光如陪伴般给人安全感'
  }
]

export const BackgroundProvider = ({ children }) => {
  // 从localStorage读取用户选择的背景，默认为晨光公园
  const [currentBackground, setCurrentBackground] = useState(() => {
    const saved = localStorage.getItem('selectedBackground')
    return saved ? JSON.parse(saved) : backgroundImages[0]
  })

  // 智能背景推荐 - 根据时间自动推荐合适的背景
  const getRecommendedBackground = () => {
    const hour = new Date().getHours()
    
    if (hour >= 6 && hour < 12) {
      // 上午时间推荐morning背景
      return backgroundImages.filter(bg => bg.time === 'morning')
    } else if (hour >= 12 && hour < 18) {
      // 下午时间推荐afternoon背景
      return backgroundImages.filter(bg => bg.time === 'afternoon')
    } else {
      // 晚上时间推荐night背景
      return backgroundImages.filter(bg => bg.time === 'night')
    }
  }

  // 切换背景
  const changeBackground = (backgroundId) => {
    const newBackground = backgroundImages.find(bg => bg.id === backgroundId)
    if (newBackground) {
      setCurrentBackground(newBackground)
      localStorage.setItem('selectedBackground', JSON.stringify(newBackground))
    }
  }

  // 随机切换背景
  const randomBackground = () => {
    const availableBackgrounds = backgroundImages.filter(bg => bg.id !== currentBackground.id)
    const randomBg = availableBackgrounds[Math.floor(Math.random() * availableBackgrounds.length)]
    changeBackground(randomBg.id)
  }

  // 根据时间智能推荐背景
  const useRecommendedBackground = () => {
    const recommended = getRecommendedBackground()
    const randomRecommended = recommended[Math.floor(Math.random() * recommended.length)]
    changeBackground(randomRecommended.id)
  }

  // 保存背景选择到localStorage
  useEffect(() => {
    localStorage.setItem('selectedBackground', JSON.stringify(currentBackground))
  }, [currentBackground])

  const value = {
    currentBackground,
    backgroundImages,
    changeBackground,
    randomBackground,
    useRecommendedBackground,
    getRecommendedBackground
  }

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  )
}

export const useBackground = () => {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider')
  }
  return context
}