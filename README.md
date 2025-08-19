# 心理治疗 + 自杀预警 AI Agent 应用

一个专注于心理健康支持和自杀预警的AI智能对话系统，旨在为有心理健康困扰的用户提供温和的情感支持和及时的风险干预。

## 🎯 项目特性

- **温和对话**: AI Agent以温和、共情的方式与用户交流
- **风险评估**: 智能识别用户的心理健康风险等级
- **实时干预**: 根据风险等级提供相应的支持和服务
- **多种服务**: 集成紧急热线、心理评估、放松游戏等多种支持服务
- **隐私保护**: 严格的数据加密和隐私保护机制

## 🏗️ 技术架构

### 前端
- **React 18**: 用户界面框架
- **Tailwind CSS**: 样式系统
- **Framer Motion**: 动画效果
- **Vite**: 构建工具

### 后端
- **Node.js + Express**: 服务器框架
- **MongoDB**: 会话数据存储
- **Redis**: 缓存和会话管理
- **AI Agent**: 自定义心理治疗对话系统

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0
- MongoDB
- Redis (可选)

### 安装依赖
```bash
npm install
```

### 启动开发服务器

#### 前端开发服务器
```bash
npm run dev
```
访问: http://localhost:3000

#### 后端API服务器
```bash
npm start
```
后端API: http://localhost:5000

### 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
psychological-therapist/
├── src/                    # 前端源码
│   ├── components/         # React 组件
│   │   ├── LandingPage.jsx    # 首页
│   │   ├── ChatInterface.jsx  # 聊天界面
│   │   ├── MessageBubble.jsx  # 消息气泡
│   │   ├── TypingIndicator.jsx # 输入指示器
│   │   ├── ServicePanel.jsx   # 服务面板
│   │   └── AdminPanel.jsx     # 管理面板
│   ├── contexts/           # React Context
│   │   └── ChatContext.jsx   # 聊天状态管理
│   ├── App.jsx            # 主应用组件
│   └── main.jsx           # 应用入口
├── server/                # 后端源码
│   ├── routes/            # API 路由
│   │   ├── chat.js          # 聊天相关API
│   │   ├── sessions.js      # 会话管理API
│   │   └── analytics.js     # 数据分析API
│   ├── services/          # 业务服务
│   │   ├── agentService.js   # AI Agent 核心逻辑
│   │   └── riskAssessment.js # 风险评估系统
│   └── index.js           # 服务器入口
├── claude.md              # 产品需求文档
├── package.json           # 项目依赖配置
└── README.md             # 项目说明文档
```

## 🤖 AI Agent 设计

### 核心原则
1. **绝对安全**: 不提供任何可能造成伤害的信息
2. **温和引导**: 使用疑问句和开放性问题
3. **简短回应**: 每次回复1-2句话，避免说教
4. **情感共鸣**: 表达理解和关心
5. **循序渐进**: 逐步了解用户状况

### 对话阶段
- **初次接触**: 建立信任和安全感
- **情感探索**: 了解用户的困扰和感受
- **风险评估**: 深入评估自杀风险
- **支持提供**: 给予情感支持和资源
- **危机干预**: 紧急情况的处理

### 风险等级
- **Low**: 一般心理压力 → 情感支持
- **Medium**: 明显抑郁情绪 → 专业建议 + 量表测评
- **High**: 自杀想法 → 紧急关注 + 热线推荐
- **Critical**: 具体自杀计划 → 立即干预 + 紧急服务

## 🔧 API 接口

### 聊天接口
```
POST /api/chat
{
  "message": "用户消息",
  "sessionId": "会话ID",
  "riskLevel": "当前风险等级",
  "userInfo": { ... }
}
```

### 会话管理
```
GET    /api/sessions          # 获取会话列表
POST   /api/sessions          # 创建新会话
GET    /api/sessions/:id      # 获取会话详情
PATCH  /api/sessions/:id      # 更新会话状态
```

### 数据分析
```
GET /api/analytics/stats      # 统计数据
GET /api/analytics/trends     # 风险趋势
GET /api/analytics/keywords   # 关键词分析
```

## 🎮 演示功能

### 用户端功能
- 温和的欢迎界面
- 流畅的对话体验
- 实时的情感反馈
- 服务推荐和资源获取
- 紧急情况的快速响应

### 管理端功能
- 实时会话监控
- 风险用户预警
- 数据统计分析
- Agent 配置管理
- 导出功能

## 🔒 隐私与安全

- 所有对话数据加密存储
- 用户身份信息匿名化处理  
- 严格的数据访问权限控制
- 符合相关隐私法规要求
- 定期数据清理和备份

## 📞 紧急联系

如果遇到紧急心理危机情况：
- **中国**: 400-161-9995 (24小时危机干预热线)
- **香港**: 852-2389-2222 (撒玛利亚会)
- **台湾**: 1995 (生命线)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## ⚠️ 免责声明

本应用旨在提供心理健康支持，但不能替代专业的心理治疗或医疗服务。在遇到严重心理健康问题时，请及时寻求专业医疗帮助。

---

*为了更好的心理健康，我们一直在努力* ❤️