# Cloudflare Pages 原生 GitHub 集成指南 🚀

## ✅ 已完成配置

- ✅ **Workers API** 已部署到 `https://bg-remover.workers.dev`
- ✅ **API Key** 已设置到 Workers 环境变量
- ✅ **前端代码** 已更新为调用 Workers API
- ✅ **代码已推送** 到 GitHub `jackie-chris/bg-remover`

---

## 📋 Cloudflare Pages 集成步骤

### 第 1 步：访问 Cloudflare Dashboard

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 导航到 **Workers & Pages**
3. 点击 **创建项目**
4. 选择 **Pages** 标签

### 第 2 步：连接到 GitHub

1. 点击 **[Connect to Git]**
2. 在 **Install & Authorize** 页面：
   - 选择你的 GitHub 账户
   - 点击 **Install & Authorize**
   - 授予 Cloudflare 访问仓库的权限

3. 在 **Choose a repository** 页面：
   - 选择 `jackie-chris/bg-remover`
   - 点击 **Begin setup**

### 第 3 步：配置构建设置

在 **Configure your project** 页面填写：

```
项目名称（可选）：bg-remover-frontend
生产分支：main
构建命令：（留空）
构建输出目录：public
根目录：/（留空）
环境变量（高级）：
  - 如果需要，可以在这里添加环境变量
  - 例如：REMOVEBG_API_KEY（但已在 Workers 中设置）
```

**点击 [保存并部署]**

### 第 4 步：等待部署完成

1. Cloudflare Pages 会自动从 GitHub 拉取代码
2. 构建过程：复制 `public/` 目录到输出目录
3. 部署通常需要 30-60 秒

### 第 5 步：获取 Pages URL

部署成功后，你会获得类似：
```
https://bg-remover-frontend.pages.dev
```

或者：
```
https://bg-remover.your-username.pages.dev
```

---

## 🎯 完整架构

```
┌─────────────────────────────────┐
│  Cloudflare Pages                 │
│  https://xxx.pages.dev           │  ← 前端静态资源（public/）
│  (GitHub 集成自动部署)            │
└──────────┬──────────────────────┘
           │ 调用 API
           ▼
┌─────────────────────────────────┐
│  Cloudflare Workers               │
│  https://bg-remover.workers.dev │  ← 后端 API（worker/index.js）
│  (独立部署)                       │
└─────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Remove.bg API                   │  ← 背景移除服务
└─────────────────────────────────┘
```

---

## 🔗 API 调用流程

1. **用户访问**：`https://xxx.pages.dev`
2. **上传图片**：前端读取文件并转换为 Base64
3. **调用 Workers API**：`POST https://bg-remover.workers.dev/api/remove-bg`
4. **Workers 处理**：调用 Remove.bg API 移除背景
5. **返回结果**：Workers 返回处理后的 PNG 图片
6. **显示结果**：前端显示原图和去背景后的图片

---

## 🧪 测试部署

### 1. 测试 Workers API

```bash
# 使用 curl 测试 Workers API
curl -X POST https://bg-remover.workers.dev/api/remove-bg \
  -H "Content-Type: application/json" \
  -d '{"image":"base64_encoded_image"}'
```

### 2. 测试前端页面

访问你的 Pages URL：
```
https://xxx.pages.dev
```

**测试步骤：**
1. 上传一张图片（JPG/PNG/WebP）
2. 等待处理完成
3. 查看去背景后的结果
4. 点击下载按钮保存图片

---

## ⚙️ 配置说明

### 前端 API 配置

在 `public/index.html` 中，Workers API 地址已配置为：

```javascript
const response = await fetch('https://bg-remover.workers.dev/api/remove-bg', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image: base64.split(',')[1]
  })
});
```

### Workers CORS 配置

Workers 已配置 CORS，允许来自任何域的前端调用：

```javascript
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
```

---

## 🔄 自动部署

由于使用了 Cloudflare Pages 原生 GitHub 集成，每次推送代码到 `main` 分支时：

1. **自动触发**：Cloudflare Pages 自动检测到新的提交
2. **自动构建**：拉取代码并复制 `public/` 目录
3. **自动部署**：部署到生产环境

**需要更新前端？**
1. 修改 `public/index.html` 或其他文件
2. 提交并推送到 GitHub：
   ```bash
   git add -A
   git commit -m "更新前端代码"
   git push origin main
   ```
3. Cloudflare Pages 会自动部署

---

## 📊 监控和日志

### 查看 Pages 部署日志

1. 访问 Cloudflare Dashboard
2. Workers & Pages → 选择你的 Pages 项目
3. 点击 **部署历史**
4. 查看每次部署的日志

### 查看 Workers 日志

```bash
cd /root/.openclaw/workspace/bg-remover
export CLOUDFLARE_API_TOKEN="cfat_QAoJ3rAzXqeC1jq2s16k0DoSSrZSX2C9WAlwwUDkf721ee0f"
npx wrangler tail
```

---

## 🆘 常见问题

### Q: 前端调用 API 失败，显示 CORS 错误

**A:** 确保 Workers 正确配置了 CORS 响应头。检查 `worker/index.js` 中的 `corsHeaders()` 函数。

### Q: 图片处理失败，显示 "API 额度已用尽"

**A:** Remove.bg API 有免费额度限制。可以：
- 等待额度恢复（通常每月重置）
- 升级到付费计划
- 使用其他背景移除 API（如 Remove.bg Pro）

### Q: Cloudflare Pages 部署失败

**A:** 检查：
1. GitHub 仓库是否有 `public/` 目录
2. `wrangler.toml` 中的 `[site]` 配置是否正确
3. 查看部署日志获取详细错误信息

### Q: Workers API 返回 500 错误

**A:** 可能原因：
- API Key 无效或过期
- Remove.bg API 暂时不可用
- Workers 配置错误

检查 Workers 日志：`npx wrangler tail`

---

## 📞 需要帮助？

如果遇到问题：
1. **检查日志**：Cloudflare Dashboard 中的部署日志
2. **查看 Workers 日志**：`npx wrangler tail`
3. **验证 API Key**：确认 REMOVEBG_API_KEY 已正确设置
4. **测试 API**：手动调用 Workers API 验证功能

---

## 🎉 完成！

恭喜！你的背景移除工具已成功部署到 Cloudflare！

**部署完成后的 URL：**
- **前端**：`https://xxx.pages.dev`（从 Cloudflare Dashboard 获取）
- **Workers API**：`https://bg-remover.workers.dev`

现在你可以分享这个工具给任何人使用了！🚀
