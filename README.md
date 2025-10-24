# AI 绘图生成工具

一个基于 AI 的绘图生成工具，用户输入文本描述，调用指定 AI 接口生成对应的 Mermaid 或 PlantUML 绘图指令，并在前端渲染为可视化图形。

## 功能特性

- 🎨 支持 Mermaid 和 PlantUML 两种图表类型
- 🤖 智能文本描述转换为图表代码
- 📱 响应式设计，支持移动端
- 💾 支持复制代码和下载图片
- 🔄 支持重新生成功能
- ✅ 实时语法验证和错误提示

<img width="1011" height="1031" alt="image" src="https://github.com/user-attachments/assets/3bde1e97-0458-43f9-a62e-bc09330d3e29" />

## 快速开始

### 1. 安装依赖

```bash
# 安装所有依赖
npm run install:all

# 或分别安装
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

[API KEY](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)

```env
PORT=3001
AI_API_KEY=your_api_key_here
AI_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
```

### 3. 启动开发服务器

```bash
# 同时启动前后端服务
npm run dev

# 或分别启动
npm run dev:backend  # 后端服务 (http://localhost:3001)
npm run dev:frontend # 前端服务 (http://localhost:5173)
```

### 4. 访问应用

前端地址：http://localhost:5173
后端地址：http://localhost:3001

## 使用说明

1. **选择图表类型**：在左侧选择 Mermaid 或 PlantUML
2. **输入描述**：在文本框中输入你想要生成的图表描述
3. **点击生成**：点击"生成"按钮，AI 将根据描述生成图表代码
4. **查看结果**：在右侧预览区域查看生成的图表
5. **更多操作**：
   - 重新生成：使用相同描述重新生成图表
   - 复制代码：复制生成的图表代码
   - 下载图片：将图表保存为图片文件

## 支持的图表类型

### Mermaid
- 流程图 (flowchart)
- 序列图 (sequenceDiagram)
- 类图 (classDiagram)
- 状态图 (stateDiagram)
- 饼图 (pie)
- 甘特图 (gantt)
- 更多...

### PlantUML
- 用例图
- 类图
- 活动图
- 组件图
- 部署图
- 更多...

## 示例描述

- "一个用户登录系统的流程图，包含输入用户名密码、验证、跳转到主页的步骤"
- "电商系统的类图，包含用户、商品、订单等类及其关系"
- "学生选课的状态图，包含选课、确认、完成等状态"

## 项目结构

```
ai-draw/
├── backend/                 # 后端服务
│   ├── index.js            # Express 服务器入口
│   ├── package.json        # 后端依赖
│   └── .env               # 环境变量配置
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── services/       # API 服务
│   │   ├── utils/          # 工具函数
│   │   ├── App.jsx         # 主应用组件
│   │   └── main.jsx        # 应用入口
│   ├── package.json        # 前端依赖
│   └── vite.config.js      # Vite 配置
├── package.json            # 根项目配置
└── README.md              # 项目说明
```

## API 接口

### POST /api/generate

请求体：
```json
{
  "description": "图表描述文本",
  "type": "mermaid" | "plantuml"
}
```

响应：
```json
{
  "success": true,
  "code": "生成的图表代码",
  "type": "图表类型"
}
```

### GET /health

健康检查接口。

## 开发说明

### 环境变量配置

确保在 `backend/.env` 中正确配置：
- `AI_API_KEY`: AI 接口的 API 密钥
- `AI_API_URL`: AI 接口地址
- `PORT`: 后端服务端口

### 常见问题

1. **跨域问题**：后端已配置 CORS，如仍有问题请检查端口配置
2. **AI 接口错误**：请检查 API 密钥是否正确，接口是否可用
3. **图表渲染失败**：检查生成的代码语法是否正确

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。
