import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Shield, Users, Star, Clock, Award, ChevronDown, Phone, BookOpen, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LandingPage = () => {
  const [isEntering, setIsEntering] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const navigate = useNavigate()
  const containerRef = useRef()
  const sectionsRef = useRef([])

  const handleStartChat = () => {
    setIsEntering(true)
    setTimeout(() => {
      navigate('/chat')
    }, 1000)
  }

  // 统一的多阶段滚动控制系统
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const sections = sectionsRef.current
      const totalHeight = 7.5 * windowHeight // 减少总滚动高度，确保第六页显示后立即结束
      
      // 计算滚动进度 (0-1)
      const totalProgress = Math.min(scrollTop / (totalHeight - windowHeight), 1)
      
      // 重新定义滚动阶段 - 紧凑分配，第六页显示后立即结束
      const stage1End = 1 / 7.5   // 阶段1：首页右侧内容内部滚动
      const stage2End = 2 / 7.5   // 阶段2：首页向上滚动到统计页面
      const stage3End = 5 / 7.5   // 阶段3：水平滚动（统计→特色→评价）
      const stage4End = 6 / 7.5   // 阶段4：评价页面向上滚动到过渡页面
      const stage5End = 7 / 7.5   // 阶段5：过渡页面向上滚动到紧急页面
      const stage6End = 1.0       // 阶段6：紧急页面完全显示
      
      if (totalProgress <= stage1End) {
        // 阶段1：首页右侧内容内部滚动
        const pageInPageContent = document.getElementById('page-in-page-content')
        if (pageInPageContent) {
          const stageProgress = totalProgress / stage1End
          const maxScrollTop = pageInPageContent.scrollHeight - pageInPageContent.clientHeight
          pageInPageContent.scrollTop = stageProgress * maxScrollTop
        }
        
        // 保持首页显示
        setCurrentSection(0)
        sections.forEach((section, index) => {
          if (!section) return
          if (index === 0) {
            section.style.transform = 'translateX(0%)'
            section.style.opacity = '1'
            section.style.zIndex = '10'
          } else if (index === 1) {
            // 第二页在下方等待，在右侧预览
            section.style.transform = 'translateX(13.33%) translateY(100%)' // 稍微显示在右侧
            section.style.opacity = '0.6'
            section.style.zIndex = '5'
          } else if (index >= 2 && index <= 3) {
            // 第三、四页在右侧等待水平滚动，显示预览
            section.style.transform = `translateX(${100 * (index - 1)}%)`
            section.style.opacity = '1'
            section.style.zIndex = '5'
          } else if (index === 4) {
            // 第五页(过渡页面)初始化在第四页下方
            section.style.transform = 'translateX(200%) translateY(100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          } else if (index === 5) {
            // 第六页(紧急页面)初始化在第五页下方
            section.style.transform = 'translateY(200%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          }
        })
      } else if (totalProgress <= stage2End) {
        // 阶段2：首页向上滚动到统计页面
        const stageProgress = (totalProgress - stage1End) / (stage2End - stage1End)
        setCurrentSection(1)
        
        sections.forEach((section, index) => {
          if (!section) return
          
          if (index === 0) {
            section.style.transform = `translateY(-${stageProgress * 100}%)`
            section.style.opacity = `${1 - stageProgress * 0.7}`
            section.style.zIndex = '9'
          } else if (index === 1) {
            section.style.transform = `translateY(${(1 - stageProgress) * 100}%)`
            section.style.opacity = `${0.3 + stageProgress * 0.7}`
            section.style.zIndex = '10'
          } else if (index >= 2 && index <= 3) {
            // 第三、四页保持在水平位置等待
            section.style.transform = `translateX(${100 * (index - 1)}%)`
            section.style.opacity = '1'
            section.style.zIndex = '5'
          } else if (index === 4) {
            // 第五页在第四页下方
            section.style.transform = 'translateX(200%) translateY(100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          } else if (index === 5) {
            // 第六页在更下方
            section.style.transform = 'translateY(200%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          }
        })
      } else if (totalProgress <= stage3End) {
        // 阶段3：纯水平滚动（统计→特色→评价）
        const stageProgress = (totalProgress - stage2End) / (stage3End - stage2End)
        
        // 计算水平偏移百分比 (0% -> -200%, 总共需要移动200%来完成3页的滚动)
        const horizontalOffset = stageProgress * 200 // 0-200%
        
        // 根据偏移量确定当前页面
        let currentPage = 1
        if (horizontalOffset <= 66.67) currentPage = 1      // 0-66.67%: 第一页(统计)
        else if (horizontalOffset <= 133.33) currentPage = 2 // 66.67-133.33%: 第二页(特色) 
        else currentPage = 3                                  // 133.33-200%: 第三页(评价)
        
        setCurrentSection(currentPage)
        
        sections.forEach((section, index) => {
          if (!section) return
          
          if (index === 0) {
            // 首页完全隐藏
            section.style.transform = 'translateY(-100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          } else if (index >= 1 && index <= 3) {
            // 三个页面水平滚动：统计(1)、特色(2)、评价(3)
            const horizontalIndex = index - 1 // 0, 1, 2
            
            // 每个页面的基础X位置: 0%, 100%, 200%
            const baseX = horizontalIndex * 100
            // 应用水平偏移
            const translateX = baseX - horizontalOffset
            
            // 设置样式
            section.style.transform = `translateX(${translateX}%)`
            section.style.opacity = '1'
            section.style.zIndex = '10'
            
            // 如果是最后一页(评价页面)且水平滚动接近完成，移除边框样式
            if (index === 3 && horizontalOffset >= 190) {
              section.style.borderRadius = '0px'
              section.style.boxShadow = 'none'
              section.style.border = 'none'
            } else {
              section.style.borderRadius = '24px'
              section.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
              section.style.border = '1px solid rgba(255, 255, 255, 0.2)'
            }
          } else if (index >= 4) {
            // 过渡页面在第四页(评价页面)下方等待
            section.style.transform = 'translateY(100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          } else {
            // 其他页面隐藏
            section.style.transform = 'translateX(-100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          }
        })
      } else if (totalProgress <= stage4End) {
        // 阶段4：评价页面(第4页)垂直滚动到过渡页面(第5页)
        const stageProgress = (totalProgress - stage3End) / (stage4End - stage3End)
        setCurrentSection(4)
        
        sections.forEach((section, index) => {
          if (!section) return
          
          if (index <= 2) {
            // 前面的页面都隐藏
            section.style.transform = 'translateX(-100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          } else if (index === 3) {
            // 评价页面(第4页)从水平滚动的最终位置向上滚动
            section.style.transform = `translateX(0%) translateY(-${stageProgress * 100}%)`
            section.style.opacity = `${1 - stageProgress * 0.7}`
            section.style.zIndex = '9'
            section.style.borderRadius = '0px'
            section.style.boxShadow = 'none'
            section.style.border = 'none'
          } else if (index === 4) {
            // 过渡页面从评价页面下方进入
            section.style.transform = `translateY(${(1 - stageProgress) * 100}%)`
            section.style.opacity = `${0.3 + stageProgress * 0.7}`
            section.style.zIndex = '10'
          } else if (index === 5) {
            // 紧急页面继续在过渡页面下方等待
            section.style.transform = 'translateY(100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          }
        })
      } else if (totalProgress <= stage5End) {
        // 阶段5：过渡页面(第5页)向上滚动，紧急页面(第6页)平滑显示
        const stageProgress = (totalProgress - stage4End) / (stage5End - stage4End)
        setCurrentSection(5)
        
        sections.forEach((section, index) => {
          if (!section) return
          
          if (index <= 3) {
            // 前面的页面都隐藏
            section.style.transform = 'translateX(-100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          } else if (index === 4) {
            // 过渡页面(第5页)向上滚动消失，使用缓动函数让过渡更平滑
            const smoothProgress = stageProgress * stageProgress * (3 - 2 * stageProgress) // 平滑缓动
            section.style.transform = `translateY(-${smoothProgress * 100}%)`
            section.style.opacity = `${1 - smoothProgress * 0.8}`
            section.style.zIndex = '9'
          } else if (index === 5) {
            // 紧急页面(第6页)从下方平滑进入
            const smoothProgress = stageProgress * stageProgress * (3 - 2 * stageProgress) // 平滑缓动
            section.style.transform = `translateY(${(1 - smoothProgress) * 100}%)`
            section.style.opacity = `${0.3 + smoothProgress * 0.7}`
            section.style.zIndex = '10'
          }
        })
      } else {
        // 阶段6：紧急页面完全显示
        setCurrentSection(5)
        
        sections.forEach((section, index) => {
          if (!section) return
          
          if (index <= 4) {
            // 前面的页面都隐藏
            section.style.transform = 'translateX(-100%)'
            section.style.opacity = '0'
            section.style.zIndex = '1'
          } else if (index === 5) {
            // 紧急页面完全显示
            section.style.transform = 'translateY(0%)'
            section.style.opacity = '1'
            section.style.zIndex = '10'
          }
        })
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始调用
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "温暖陪伴",
      description: "24小时温和倾听，理解你的感受",
      image: "🤗"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "安全保护", 
      description: "专业的风险评估和及时干预",
      image: "🛡️"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "智能对话",
      description: "自然的对话体验，循序渐进的引导",
      image: "💬"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "专业支持",
      description: "连接专业心理咨询师和紧急热线",
      image: "🤝"
    }
  ]
  
  const testimonials = [
    {
      name: "小李",
      age: 25,
      text: "在最黑暗的时候，AI助手给了我温暖的陪伴，让我重新找到了生活的希望。",
      rating: 5,
      image: "👤"
    },
    {
      name: "小王", 
      age: 30,
      text: "专业的对话引导让我学会了如何处理情绪，现在的我比以前更加坚强。",
      rating: 5,
      image: "👤"
    },
    {
      name: "小张",
      age: 22,
      text: "24小时的支持让我知道，无论何时我都不是孤单一人。",
      rating: 5,
      image: "👤"
    }
  ]
  
  const stats = [
    { number: "50,000+", label: "用户信任", icon: <Users className="w-5 h-5" /> },
    { number: "99.9%", label: "响应率", icon: <Clock className="w-5 h-5" /> },
    { number: "4.9", label: "用户评分", icon: <Star className="w-5 h-5" /> },
    { number: "24/7", label: "全天服务", icon: <Heart className="w-5 h-5" /> }
  ]

  return (
    <div className="codebuddy-container w-full relative overflow-x-hidden" ref={containerRef}>
      {/* 固定在右侧的滚动指示器 */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-3">
          {['首页', '数据', '特色', '评价', '紧急'].map((name, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSection ? 'bg-primary-500 scale-125 shadow-lg' : 'bg-white/70 hover:bg-gray-400 backdrop-blur-sm'
              }`}
              onClick={() => window.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })}
              title={name}
            />
          ))}
        </div>
      </div>

      {/* 主要内容区域 - 7.5个滚动阶段的高度 */}
      <div className="sections-container" style={{ height: `${7.5 * 100}vh` }}>
        {/* Section 1 - 英雄区域 （左右分区设计） */}
        <div 
          className="section homepage fixed inset-0 w-full h-screen transition-all duration-700 ease-out bg-gradient-to-br from-blue-50 to-pink-50" 
          ref={el => sectionsRef.current[0] = el}
          style={{ zIndex: 5 }}
        >
          <div className="h-full flex items-center relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-primary-100/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-warm-100/30 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* 左侧主要内容 */}
            <div className="w-1/2 h-full flex flex-col items-center justify-center px-8 relative z-10">
              <motion.div 
                className="max-w-2xl text-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-warm-500 rounded-full mb-8 floating-animation shadow-2xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Heart className="w-12 h-12 text-white" />
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6 text-shadow">
                  你不是一个人
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                  我是你的AI心理健康助手，随时准备倾听你的故事。<br />
                  无论你现在感受如何，这里都是安全的空间。
                </p>
                
                <motion.button
                  onClick={handleStartChat}
                  disabled={isEntering}
                  className="px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-xl pulse-glow disabled:opacity-50 mb-6"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isEntering ? (
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      正在准备...
                    </span>
                  ) : (
                    "立即开始对话 💬"
                  )}
                </motion.button>
                
                <p className="text-lg text-gray-500">
                  点击开始，我们来聊聊吧 ♡
                </p>
              </motion.div>
            </div>

            {/* 右侧页中页滚动区域 */}
            <div className="w-1/2 h-full relative z-10 px-8">
              <motion.div 
                className="h-full flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="w-full max-w-lg h-4/5 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  {/* 页中页头部 */}
                  <div className="bg-gradient-to-r from-primary-500 to-warm-500 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">用户真实体验</h3>
                    <p className="text-primary-100 text-sm">看看他们如何重新找到希望</p>
                  </div>
                  
                  {/* 统一滚动控制的内容区域 - 移除独立滚动 */}
                  <div className="inner-scroll-content p-6 space-y-6 h-full overflow-hidden" id="page-in-page-content">
                    {/* 第一个聊天截图 */}
                    <div className="chat-preview bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-700">你好，我注意到你可能正在经历一些困难时期。我在这里倾听你的心声。</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="max-w-xs">
                          <div className="bg-primary-500 rounded-lg p-3">
                            <p className="text-sm text-white">我最近感到很低落，不知道该怎么办...</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    {/* 第一个用户反馈 */}
                    <div className="feedback-card bg-gradient-to-r from-warm-50 to-primary-50 rounded-2xl p-4 border border-warm-200/50">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">👤</div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-800 mr-2">小玉</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 italic">"在最黑暗的时候，AI助手给了我温暖的陪伴，让我重新找到了生活的希望。"</p>
                        </div>
                      </div>
                    </div>

                    {/* 第二个聊天截图 */}
                    <div className="chat-preview bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-700">你的感受很重要，让我们一起来寻找应对的方法。你可以告诉我是什么让你感到焦虑吗？</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="max-w-xs">
                          <div className="bg-primary-500 rounded-lg p-3">
                            <p className="text-sm text-white">是工作压力，我总是担心做不好...</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    {/* 第二个用户反馈 */}
                    <div className="feedback-card bg-gradient-to-r from-primary-50 to-warm-50 rounded-2xl p-4 border border-primary-200/50">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">👤</div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-800 mr-2">小明</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 italic">"专业的对话引导让我学会了如何处理情绪，现在的我比以前更加坚强。"</p>
                        </div>
                      </div>
                    </div>

                    {/* 第三个聊天截图 */}
                    <div className="chat-preview bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-700">我理解你的担心。让我们尝试一些放松的技巧吧。你可以先深呼吸三次...</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="max-w-xs">
                          <div className="bg-primary-500 rounded-lg p-3">
                            <p className="text-sm text-white">好的，我试试看...</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    {/* 第三个用户反馈 */}
                    <div className="feedback-card bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200/50">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">👤</div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-800 mr-2">小华</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 italic">"每次心情低落时，这里都有温暖的陪伴。真的很感谢有这样一个地方。"</p>
                        </div>
                      </div>
                    </div>

                    {/* 第四个聊天截图 */}
                    <div className="chat-preview bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-700">你做得很棒！记住，每个人都值得被爱和关怀。你不是一个人在面对这些。</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="max-w-xs">
                          <div className="bg-primary-500 rounded-lg p-3">
                            <p className="text-sm text-white">谢谢你，我现在感觉好多了。</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    {/* 成功故事统计 */}
                    <div className="success-story bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200/50">
                      <div className="text-center">
                        <div className="text-4xl mb-2">✨</div>
                        <h4 className="font-bold text-gray-800 mb-2">成功故事</h4>
                        <p className="text-sm text-gray-600">已帮助 <span className="font-bold text-primary-600">50,000+</span> 用户重新找到内心的平静</p>
                      </div>
                    </div>

                    {/* 专业认证 */}
                    <div className="certification bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <h4 className="font-bold text-gray-800">专业认证</h4>
                          <p className="text-sm text-gray-600">由心理健康专家团队设计</p>
                        </div>
                      </div>
                    </div>

                    {/* 24小时支持 */}
                    <div className="support-info bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🕰️</div>
                        <h4 className="font-bold text-gray-800 mb-2">24/7 全天候支持</h4>
                        <p className="text-sm text-gray-600">无论什么时候，我们都在这里陪伴你</p>
                      </div>
                    </div>

                    {/* 安全保障 */}
                    <div className="security-info bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🔒</div>
                        <div>
                          <h4 className="font-bold text-gray-800">隐私安全</h4>
                          <p className="text-sm text-gray-600">你的对话完全加密保护</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Section 2 - 数据统计 (水平滚动) */}
        <div 
          className="section horizontal-scroll fixed inset-0 w-full h-screen transition-all duration-700 ease-out bg-gradient-to-br from-warm-50 to-primary-50" 
          ref={el => sectionsRef.current[1] = el}
          style={{ zIndex: 4, transform: 'translateY(100%)', opacity: 0.3 }}
        >
          <div className="h-full flex items-center justify-center py-20 px-8">
            <div className="max-w-6xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-6 text-shadow">
                  值得信赖的选择 🌟
                </h2>
                <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
                  已有数万用户选择我们的AI心理健康服务，获得专业、温暖、及时的心理支持
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-effect rounded-2xl p-8 text-center floating-card"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 mx-auto text-primary-600">
                      {stat.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium text-lg">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 - 特性展示 (水平滚动) */}
        <div 
          className="section horizontal-scroll fixed inset-0 w-full h-screen transition-all duration-700 ease-out bg-gradient-to-br from-gray-50 to-blue-50" 
          ref={el => sectionsRef.current[2] = el}
          style={{ zIndex: 3 }}
        >
          <div className="h-full flex items-center justify-center py-20 px-8">
            <div className="max-w-6xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-6 text-shadow">
                  为什么选择我们 ✨
                </h2>
                <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
                  结合专业心理学知识和AI技术，为你提供最贴心的心理健康服务
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="glass-effect rounded-2xl p-10 floating-card"
                  >
                    <div className="flex items-start space-x-6">
                      <div className="text-6xl mb-4">
                        {feature.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                          {feature.icon}
                          <span className="ml-4">{feature.title}</span>
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-xl">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 - 用户评价 (水平滚动) */}
        <div 
          className="section horizontal-scroll fixed inset-0 w-full h-screen transition-all duration-700 ease-out bg-gradient-to-br from-primary-50 to-warm-50" 
          ref={el => sectionsRef.current[3] = el}
          style={{ zIndex: 2 }}
        >
          <div className="h-full flex items-center justify-center py-20 px-8">
            <div className="max-w-6xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-6 text-shadow">
                  用户真实反馈 💝
                </h2>
                <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
                  听听那些曾经和你一样迷茫的人们，是如何通过我们的服务重新找到生活的希望
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="glass-effect rounded-2xl p-8 floating-card"
                  >
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">{testimonial.image}</div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-xl">{testimonial.name}</h4>
                        <p className="text-gray-500">{testimonial.age}岁</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic text-lg">
                      "{testimonial.text}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 - 过渡页面 */}
        <div 
          className="section fixed inset-0 w-full h-screen transition-all duration-700 ease-out bg-gradient-to-br from-purple-50 to-blue-50" 
          ref={el => sectionsRef.current[4] = el}
          style={{ zIndex: 1, transform: 'translateY(100%)', opacity: 0.3 }}
        >
          <div className="h-full flex items-center justify-center py-20 px-8">
            <div className="max-w-4xl mx-auto text-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass-effect rounded-3xl p-16 bg-gradient-to-r from-purple-50 to-blue-100 border border-purple-200"
              >
                <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-8 mx-auto">
                  <Heart className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-purple-800 mb-8 text-shadow">
                  我们一直在这里 💜
                </h2>
                <p className="text-xl text-purple-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                  无论你现在经历什么，请记住你并不孤单。我们理解你的痛苦，也相信你的坚强。
                  如果你需要更多帮助，以下是一些专业的支持渠道。
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl mb-3">🤝</div>
                    <h4 className="font-bold text-purple-800 mb-2">专业咨询</h4>
                    <p className="text-purple-600 text-sm">预约专业心理咨询师</p>
                  </div>
                  <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl mb-3">📞</div>
                    <h4 className="font-bold text-purple-800 mb-2">热线电话</h4>
                    <p className="text-purple-600 text-sm">24小时心理支持热线</p>
                  </div>
                  <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl mb-3">🏥</div>
                    <h4 className="font-bold text-purple-800 mb-2">医疗机构</h4>
                    <p className="text-purple-600 text-sm">就近的心理健康中心</p>
                  </div>
                </div>
                
                <motion.button
                  className="px-10 py-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 text-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  寻找专业帮助
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Section 6 - 紧急求助 */}
        <div 
          className="section fixed inset-0 w-full h-screen transition-all duration-700 ease-out bg-gradient-to-br from-red-50 to-pink-50" 
          ref={el => sectionsRef.current[5] = el}
          style={{ zIndex: 1, transform: 'translateY(100%)', opacity: 0.3 }}
        >
          <div className="h-full flex items-center justify-center py-20 px-8">
            <div className="max-w-4xl mx-auto text-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass-effect rounded-3xl p-16 bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
              >
                <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-8 mx-auto">
                  <Phone className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-red-800 mb-8 text-shadow">
                  紧急情况 🆘
                </h2>
                <p className="text-xl text-red-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                  如果你正处于危险中或有自杀想法，请不要犹豫，立即寻求帮助。你的生命很珍贵，总有人愿意倾听和帮助你。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <div className="bg-white/90 rounded-2xl p-8 shadow-lg">
                    <h4 className="font-bold text-red-800 mb-3 text-xl">中国大陆</h4>
                    <p className="text-3xl font-mono text-red-700 font-bold">400-161-9995</p>
                    <p className="text-red-600 mt-2">24小时心理危机干预热线</p>
                  </div>
                  <div className="bg-white/90 rounded-2xl p-8 shadow-lg">
                    <h4 className="font-bold text-red-800 mb-3 text-xl">香港地区</h4>
                    <p className="text-3xl font-mono text-red-700 font-bold">852-2389-2222</p>
                    <p className="text-red-600 mt-2">撒玛利亚防止自杀会</p>
                  </div>
                </div>
                <motion.button
                  className="mt-12 px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 text-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  立即寻求帮助
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage