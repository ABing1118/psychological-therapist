#!/usr/bin/env node

/**
 * 开发环境启动脚本
 * 
 * 这个脚本用于同时启动前端和后端服务
 * 包含了基本的环境检查和服务启动逻辑
 */

import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径（ES模块中替代__dirname）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 启动心理治疗AI应用开发环境...\n')

// 检查环境
function checkEnvironment() {
  console.log('🔍 检查开发环境...')
  
  // 检查 Node.js 版本
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  
  if (majorVersion < 16) {
    console.error('❌ 需要 Node.js 16 或更高版本')
    process.exit(1)
  }
  
  console.log(`✅ Node.js 版本: ${nodeVersion}`)
  
  // 检查依赖是否安装
  if (!fs.existsSync(path.join(__dirname, '../node_modules'))) {
    console.log('📦 检测到依赖未安装，正在安装...')
    const install = spawn('npm', ['install'], {
      stdio: 'inherit',
      shell: true
    })
    
    install.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ 依赖安装失败')
        process.exit(1)
      }
      startServices()
    })
  } else {
    startServices()
  }
}

// 启动服务
function startServices() {
  console.log('\n🌟 启动开发服务...')
  
  // 启动后端服务器
  console.log('🔧 启动后端API服务器 (端口: 5001)...')
  const backend = spawn('node', ['server/index.js'], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '5001'
    }
  })
  
  // 等待后端启动后再启动前端
  setTimeout(() => {
    console.log('⚛️  启动前端开发服务器 (端口: 3000)...')
    const frontend = spawn('npm', ['run', 'dev'], {
      stdio: ['inherit', 'inherit', 'inherit']
    })
    
    frontend.on('error', (error) => {
      console.error('❌ 前端服务启动失败:', error.message)
    })
    
  }, 3000)
  
  backend.on('error', (error) => {
    console.error('❌ 后端服务启动失败:', error.message)
  })
  
  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n📴 正在关闭开发服务器...')
    backend.kill()
    process.exit(0)
  })
  
  console.log('\n📍 服务地址:')
  console.log('   前端应用: http://localhost:3000')
  console.log('   后端API:  http://localhost:5001')
  console.log('   管理面板: http://localhost:3000/admin')
  console.log('\n💡 提示: 按 Ctrl+C 停止服务')
  console.log('─'.repeat(50))
}

// 显示演示信息
function showDemoInfo() {
  console.log('\n🎮 演示功能:')
  console.log('1. 访问首页体验基本对话功能')
  console.log('2. 尝试不同的情感表达，观察AI响应')
  console.log('3. 访问 /admin 查看管理面板')
  console.log('4. 测试不同风险等级的对话场景\n')
  
  console.log('🔧 开发工具:')
  console.log('- React DevTools: 浏览器扩展')
  console.log('- API测试: http://localhost:5000/api/health')
  console.log('- 日志监控: 查看终端输出\n')
}

// 主函数
function main() {
  showDemoInfo()
  checkEnvironment()
}

// 直接执行主函数，不需要检查是否为主模块
main()