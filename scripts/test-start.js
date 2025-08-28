#!/usr/bin/env node

/**
 * 测试环境启动脚本
 * 
 * 这个脚本用于启动测试环境服务
 * 别人测试时使用，不会受到开发代码改动的影响
 */

import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径（ES模块中替代__dirname）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 启动心理治疗AI应用测试环境...\n')

// 检查环境
function checkEnvironment() {
  console.log('🔍 检查测试环境...')
  
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
  console.log('\n🌟 启动测试环境服务...')
  
  // 启动后端服务器
  console.log('🔧 启动后端API服务器 (端口: 5001)...')
  const backend = spawn('node', ['server/index.js'], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: {
      ...process.env,
      NODE_ENV: 'testing',
      PORT: '5001',
      HOST: '0.0.0.0'
    }
  })
  
  // 等待后端启动后再启动前端
  setTimeout(() => {
    console.log('⚛️  启动前端测试服务器 (端口: 3001)...')
    const frontend = spawn('npm', ['run', 'dev'], {
      stdio: ['inherit', 'inherit', 'inherit'],
      env: {
        ...process.env,
        NODE_ENV: 'testing'
      }
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
    console.log('\n📴 正在关闭测试服务器...')
    backend.kill()
    process.exit(0)
  })
  
  console.log('\n📍 测试环境服务地址:')
  console.log('   前端应用: http://localhost:3001')
  console.log('   前端应用: http://172.26.72.31:3001')
  console.log('   后端API:  http://localhost:5001')
  console.log('   后端API:  http://172.26.72.31:5001')
  console.log('   管理面板: http://localhost:3001/admin')
  console.log('   管理面板: http://172.26.72.31:3001/admin')
  console.log('\n💡 提示: 按 Ctrl+C 停止服务')
  console.log('─'.repeat(50))
}

// 显示测试信息
function showTestInfo() {
  console.log('\n🧪 测试环境说明:')
  console.log('1. 这是测试环境，不会受到开发代码改动的影响')
  console.log('2. 前端运行在3001端口，后端运行在5001端口')
  console.log('3. 支持网络访问，其他设备可通过IP地址访问')
  console.log('4. 适合进行功能测试和演示\n')
  
  console.log('🔧 测试工具:')
  console.log('- 前端测试: http://172.26.72.31:3001')
  console.log('- API测试: http://172.26.72.31:5001/api/health')
  console.log('- 日志监控: 查看终端输出\n')
}

// 主函数
function main() {
  showTestInfo()
  checkEnvironment()
}

// 直接执行主函数，不需要检查是否为主模块
main()
