// Glimmer API 服务层
// 用于连接后端心理健康支持系统

import axios from 'axios';

// 后端API配置
const GLIMMER_API_BASE = 'http://localhost:8000';

// 创建axios实例
const glimmerApi = axios.create({
  baseURL: GLIMMER_API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
glimmerApi.interceptors.request.use(
  (config) => {
    console.log('🚀 Glimmer API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Glimmer API Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
glimmerApi.interceptors.response.use(
  (response) => {
    console.log('✅ Glimmer API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Glimmer API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Glimmer API服务类
 */
export class GlimmerApiService {
  
  /**
   * 发送聊天消息到Glimmer后端
   * @param {Object} params - 聊天参数
   * @param {string} params.user_id - 用户ID
   * @param {string} params.message - 用户消息
   * @param {string} params.session_id - 会话ID（可选）
   * @returns {Promise<Object>} - 后端响应
   */
  static async sendChatMessage({ user_id, message, session_id = null }) {
    try {
      const payload = {
        user_id,
        message,
        session_id
      };

      const response = await glimmerApi.post('/chat', payload);
      
      // 根据CLAUDE.md中的接口规格处理响应
      const data = response.data;
      
      return {
        success: true,
        session_id: data.session_id,
        character_state: data.character_state,
        action: data.action,
        emoji: data.emoji,
        content: data.content,
        risk_level: data.risk_level,
        raw_response: data
      };
    } catch (error) {
      console.error('Glimmer chat API error:', error);
      
      // 处理不同类型的错误
      if (error.response) {
        // 服务器响应错误
        return {
          success: false,
          error: error.response.data?.detail || '服务器响应错误',
          status: error.response.status
        };
      } else if (error.request) {
        // 网络错误
        return {
          success: false,
          error: '网络连接失败，请检查后端服务是否启动',
          network_error: true
        };
      } else {
        // 其他错误
        return {
          success: false,
          error: error.message || '未知错误'
        };
      }
    }
  }

  /**
   * 获取用户会话列表
   * @param {string} user_id - 用户ID
   * @returns {Promise<Object>} - 会话列表
   */
  static async getUserSessions(user_id) {
    try {
      const response = await glimmerApi.get(`/sessions/${user_id}`);
      return {
        success: true,
        user_id: response.data.user_id,
        sessions: response.data.sessions
      };
    } catch (error) {
      console.error('Get user sessions error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  /**
   * 获取会话对话历史
   * @param {string} session_id - 会话ID
   * @returns {Promise<Object>} - 对话历史
   */
  static async getConversationHistory(session_id) {
    try {
      const response = await glimmerApi.get(`/conversation/${session_id}`);
      return {
        success: true,
        session_id: response.data.session_id,
        conversation: response.data.conversation
      };
    } catch (error) {
      console.error('Get conversation history error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  /**
   * 删除会话
   * @param {string} session_id - 会话ID
   * @returns {Promise<Object>} - 删除结果
   */
  static async deleteSession(session_id) {
    try {
      const response = await glimmerApi.delete(`/session/${session_id}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Delete session error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  /**
   * 健康检查
   * @returns {Promise<boolean>} - 后端是否可用
   */
  static async healthCheck() {
    try {
      // 尝试发送一个简单的测试请求
      const response = await glimmerApi.get('/docs', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('Glimmer backend health check failed:', error.message);
      return false;
    }
  }

  /**
   * 解析后端返回的actions字符串
   * 将逗号分隔的actions字符串转换为数组
   * @param {string} actionString - 后端返回的action字符串
   * @returns {Array<string>} - action数组
   */
  static parseActions(actionString) {
    if (!actionString || typeof actionString !== 'string') {
      return [];
    }
    
    return actionString
      .split(',')
      .map(action => action.trim())
      .filter(action => action.length > 0);
  }

  /**
   * 将后端character_state映射为前端可识别的状态
   * @param {string} backendState - 后端返回的character_state
   * @returns {string} - 前端character state
   */
  static mapCharacterState(backendState) {
    const stateMapping = {
      'general': 'general',
      'greeting': 'greeting', 
      'listening': 'listening',
      'encourage': 'encourage',
      'great': 'great',
      'clapping': 'clapping',
      'relaxing': 'relaxing',
      'tips': 'tips'
    };
    
    return stateMapping[backendState] || 'general';
  }

  /**
   * 将后端风险等级映射为前端可识别的等级
   * @param {string} backendRiskLevel - 后端返回的risk_level
   * @returns {string} - 前端风险等级
   */
  static mapRiskLevel(backendRiskLevel) {
    const riskMapping = {
      'none': 'none',
      'low': 'low', 
      'medium': 'medium',
      'high': 'high'
    };
    
    return riskMapping[backendRiskLevel] || 'none';
  }
}

export default GlimmerApiService;