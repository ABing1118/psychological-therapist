# 前后端集成测试指南

## 项目架构说明

本项目包含两个主要部分：
- 前端：`~/Code/psychological therapist` - React + Vite 心理健康聊天界面
- 后端：`~/Code/baidu/personal-code/glimmer` - FastAPI 心理支持对话系统

## 启动顺序

### 1. 启动后端服务 (Glimmer)

```bash
# 进入后端目录
cd ~/Code/baidu/personal-code/glimmer

# 激活虚拟环境（如果有）
source venv/bin/activate

# 安装依赖（首次运行）
pip install -r requirements.txt

# 启动后端服务
python main.py
# 或者使用完整启动脚本
python start_server.py
```

后端服务将在 `http://localhost:8000` 启动
后端服务网络地址：`http://172.26.72.31:8000`

### 2. 启动前端服务

```bash
# 进入前端目录  
cd ~/Code/psychological therapist

# 安装依赖（首次运行）
npm install

# 启动前端开发服务器
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

## 集成功能测试

### 1. 基础对话测试

1. 在前端聊天界面输入消息
2. 检查浏览器控制台是否显示API调用日志
3. 验证后端是否收到请求并返回响应
4. 确认前端正确显示AI回复和表情包

### 2. 风险评估测试

测试输入：
```
我感觉很绝望，不想活了
```

预期行为：
- 后端检测到高风险关键词
- 返回高风险等级
- 前端显示紧急联系卡片
- 触发相应的干预措施

### 3. Actions功能测试

#### 游戏推荐测试
测试输入：
```  
我想放松一下
```
预期：后端返回 `action: "push_game_card"`，前端显示游戏推荐卡片

#### 音乐推荐测试  
测试输入：
```
我需要听点音乐
```
预期：后端返回 `action: "push_music_card"`，前端显示音乐卡片

#### 心理测试推荐
测试输入：
```
我想了解自己的心理状况
```
预期：后端返回 `action: "push_psychological_test"`，前端显示测试邀请

#### 穿戴设备数据请求
测试输入：
```
我最近心跳很快，睡眠也不好
```
预期：后端返回 `action: "push_wearable_data"`，前端请求穿戴设备数据

### 4. 角色状态测试

测试不同的输入，验证前端角色状态是否正确切换：
- `character_state: "listening"` - 角色切换为倾听状态
- `character_state: "encourage"` - 角色切换为鼓励状态  
- `character_state: "relaxing"` - 角色切换为放松状态

## 调试工具

### 前端调试
- 打开浏览器开发者工具 (F12)
- 查看 Console 标签页的API调用日志
- 查看 Network 标签页的请求响应详情

### 后端调试
- 查看终端输出的请求日志
- 检查后端服务状态
- 使用 `http://localhost:8000/docs` 查看API文档
- 使用 `http://172.26.72.31:8000/docs` 查看API文档（网络访问）

## 常见问题排查

### 1. 连接失败
- 确认后端服务在 8000 端口运行
- 确认后端服务可通过 `http://172.26.72.31:8000` 访问
- 检查CORS配置是否正确
- 验证网络防火墙设置

### 2. API调用错误
- 检查请求格式是否符合后端期望
- 验证必要的参数是否传递
- 查看后端错误日志

### 3. 前端显示异常
- 检查浏览器控制台是否有JavaScript错误
- 验证组件状态更新是否正确
- 确认CSS样式是否加载

## 测试用例

### 正常对话流程
1. 用户：`你好`
2. 预期：AI问候，character_state为greeting
3. 用户：`我今天有点沮丧`
4. 预期：AI表达关心，character_state为listening

### 风险检测流程
1. 用户：`我感觉人生没有意义，想结束一切`
2. 预期：高风险检测，emergency_call action，显示紧急联系
3. 验证紧急联系卡片正确显示

### 服务推荐流程
1. 用户：`我压力很大，需要放松`
2. 预期：push_music_card或push_game_card action
3. 验证相应卡片正确显示

## 性能测试

- 测试API响应时间（应在3秒内）
- 测试并发用户访问
- 验证内存和CPU使用情况
- 检查长时间运行的稳定性

## 部署准备

完成测试后，确认以下准备工作：
- [ ] 前后端通信正常
- [ ] 所有actions功能正确执行
- [ ] 错误处理机制完善
- [ ] 用户体验流畅
- [ ] 安全措施到位