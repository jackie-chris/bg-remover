# 🎨 BG Remover - 图片背景移除工具

一键去除图片背景，基于 Cloudflare Workers + Remove.bg API。

![Demo](https://img.shields.io/badge/Status-MVP-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ 特性

- 🚀 **极简使用** - 拖拽上传，一键去背景
- ⚡ **秒级处理** - 边缘计算，全球加速
- 🔒 **隐私安全** - 图片不存储，内存直传
- 📱 **移动适配** - 响应式设计，手机友好

## 🛠 技术栈

| 层 | 技术 |
|---|------|
| 前端 | HTML/CSS/JS |
| 托管 | Cloudflare Pages |
| API | Cloudflare Workers |
| 图片处理 | Remove.bg API |

## 📦 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/jackie-chris/bg-remover.git
cd bg-remover
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

获取 [Remove.bg API Key](https://www.remove.bg/api)，然后设置：

```bash
npx wrangler secret put REMOVEBG_API_KEY
```

### 4. 本地开发

```bash
npm run dev
```

访问 http://localhost:8787

### 5. 部署到 Cloudflare

```bash
npm run deploy
```

## 🔧 项目结构

```
bg-remover/
├── public/
│   └── index.html      # 前端页面
├── worker/
│   └── index.js        # Worker API
├── wrangler.toml       # Cloudflare 配置
├── package.json
└── README.md
```

## 📖 API 说明

### POST /api/remove-bg

**请求：**
```json
{
  "image": "<base64-encoded-image>"
}
```

**响应：**
- 成功：返回 PNG 二进制流
- 失败：返回 JSON 错误信息

**错误码：**

| 错误码 | 说明 |
|--------|------|
| NO_IMAGE | 未提供图片 |
| INVALID_IMAGE | 图片格式无效 |
| QUOTA_EXCEEDED | API 额度用尽 |
| API_ERROR | 服务暂时不可用 |

## 💰 成本

| 服务 | 免费额度 |
|------|----------|
| Cloudflare Workers | 10万次/天 |
| Remove.bg | 50张/月 |

## 📝 TODO

- [ ] 批量处理
- [ ] 自定义背景色
- [ ] 历史记录
- [ ] 用户系统

## 📄 License

MIT License - 自由使用

---

Made with ❤️ by [jackie-chris](https://github.com/jackie-chris)
