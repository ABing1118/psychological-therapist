// 环境配置文件
// 用于管理开发环境和测试环境的端口配置

const environments = {
  // 开发环境 - 本地开发使用
  development: {
    frontend: {
      port: 3000,
      host: 'localhost'
    },
    backend: {
      port: 5000,
      host: 'localhost'
    },
    python: {
      port: 8000,
      host: 'localhost'
    }
  },
  
  // 测试环境 - 别人测试使用
  testing: {
    frontend: {
      port: 3001,
      host: '0.0.0.0'  // 监听所有网络接口，支持IP访问
    },
    backend: {
      port: 5001,
      host: '0.0.0.0'
    },
    python: {
      port: 8001,
      host: '0.0.0.0'
    }
  }
};

// 获取当前环境配置
const getCurrentEnv = () => {
  return process.env.NODE_ENV === 'testing' ? 'testing' : 'development';
};

// 获取指定环境的配置
const getEnvConfig = (env = null) => {
  const currentEnv = env || getCurrentEnv();
  return environments[currentEnv];
};

// 获取当前环境的配置
const getCurrentConfig = () => {
  return getEnvConfig();
};

// 构建完整的URL
const buildUrl = (service, env = null) => {
  const config = getEnvConfig(env);
  const serviceConfig = config[service];
  
  if (!serviceConfig) {
    throw new Error(`未知的服务类型: ${service}`);
  }
  
  return `http://${serviceConfig.host === '0.0.0.0' ? '172.26.72.31' : serviceConfig.host}:${serviceConfig.port}`;
};

export {
  environments,
  getCurrentEnv,
  getEnvConfig,
  getCurrentConfig,
  buildUrl
};
