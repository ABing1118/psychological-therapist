#!/usr/bin/env node

/**
 * Python端口路由测试脚本
 * 演示前端端口如何自动选择对应的Python端口
 */

import { getCurrentEnv, getEnvConfig, buildUrl } from '../config/environments.js';

console.log('🐍 测试Python端口路由机制...\n');

// 模拟开发环境
console.log('📝 开发环境 (3000端口):');
process.env.NODE_ENV = 'development';
console.log('当前环境:', getCurrentEnv());
console.log('前端端口:', getEnvConfig().frontend.port);
console.log('Python端口:', getEnvConfig().python.port);
console.log('Python URL:', buildUrl('python'));
console.log('路由规则: 3000端口 → 8000端口');
console.log('');

// 模拟测试环境
console.log('🧪 测试环境 (3001端口):');
process.env.NODE_ENV = 'testing';
console.log('当前环境:', getCurrentEnv());
console.log('前端端口:', getEnvConfig().frontend.port);
console.log('Python端口:', getEnvConfig().python.port);
console.log('Python URL:', buildUrl('python'));
console.log('路由规则: 3001端口 → 8001端口');
console.log('');

console.log('🎯 端口映射总结:');
console.log('┌─────────────┬─────────────┬─────────────┐');
console.log('│ 前端端口    │ 环境        │ Python端口  │');
console.log('├─────────────┼─────────────┼─────────────┤');
console.log('│ 3000        │ development │ 8000        │');
console.log('│ 3001        │ testing     │ 8001        │');
console.log('└─────────────┴─────────────┴─────────────┘');
console.log('');

console.log('✅ Python端口路由测试完成！');
