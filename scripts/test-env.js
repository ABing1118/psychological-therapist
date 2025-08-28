#!/usr/bin/env node

/**
 * 环境配置测试脚本
 * 用于验证环境配置是否正确
 */

import { getCurrentEnv, getEnvConfig, buildUrl } from '../config/environments.js';

console.log('🧪 测试环境配置...\n');

// 测试开发环境
console.log('📝 开发环境配置:');
process.env.NODE_ENV = 'development';
console.log('当前环境:', getCurrentEnv());
console.log('前端配置:', getEnvConfig().frontend);
console.log('后端配置:', getEnvConfig().backend);
console.log('Python配置:', getEnvConfig().python);
console.log('前端URL:', buildUrl('frontend'));
console.log('后端URL:', buildUrl('backend'));
console.log('Python URL:', buildUrl('python'));
console.log('');

// 测试测试环境
console.log('🧪 测试环境配置:');
process.env.NODE_ENV = 'testing';
console.log('当前环境:', getCurrentEnv());
console.log('前端配置:', getEnvConfig().frontend);
console.log('后端配置:', getEnvConfig().backend);
console.log('Python配置:', getEnvConfig().python);
console.log('前端URL:', buildUrl('frontend'));
console.log('后端URL:', buildUrl('backend'));
console.log('Python URL:', buildUrl('python'));
console.log('');

console.log('✅ 环境配置测试完成！');
