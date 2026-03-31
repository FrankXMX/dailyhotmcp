# 发布手册

本文档记录 DailyHotMCP 项目的发布流程，包括 NPM 包发布和 MCP 注册表发布。

## 前置要求

### 1. NPM 账号配置

需要 NPM 账号并满足以下条件之一：
- 启用双因素认证 (2FA)
- 创建带有 `bypass 2fa enabled` 权限的细粒度访问令牌

**配置 NPM Token**：
```bash
npm config set //registry.npmjs.org/:_authToken <你的token>
```

### 2. MCP Registry 账号

需要登录 MCP Publisher：
```bash
mcp-publisher login
```

## 发布流程

### 步骤 1：更新版本号

编辑 `package.json`，将版本号从当前版本升级（例如 `0.1.4` → `0.1.5`）：

```json
{
  "name": "@frank-x/dailyhot-mcp",
  "version": "0.1.5",
  "mcpName": "io.github.FrankXMX/dailyhotmcp"
}
```

> 注意：`mcpName` 字段必须与 MCP 注册表权限匹配（`io.github.FrankXMX/*`）

### 步骤 2：配置 server.json

编辑 `server.json`，确保版本号与 package.json 一致：

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.FrankXMX/dailyhotmcp",
  "description": "聚合55+平台热门榜单数据的AI工具，支持微博、知乎、B站、GitHub等平台。适用于LLM/RAG场景。",
  "repository": {
    "url": "https://github.com/FrankXMX/dailyhotmcp",
    "source": "github"
  },
  "version": "0.1.5",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "@frank-x/dailyhot-mcp",
      "version": "0.1.5",
      "transport": {
        "type": "stdio"
      },
      "environmentVariables": []
    }
  ]
}
```

> 注意：
> - `description` 限制 100 字符以内
> - `name` 必须匹配你的 MCP 注册表权限
> - `version` 必须与 NPM 包版本一致

### 步骤 3：发布 NPM 包

```bash
npm publish
```

成功输出示例：
```
+ @frank-x/dailyhot-mcp@0.1.5
```

### 步骤 4：发布 MCP 注册表

```bash
mcp-publisher publish
```

成功输出示例：
```
Publishing to https://registry.modelcontextprotocol.io...
✓ Successfully published
✓ Server io.github.FrankXMX/dailyhotmcp version 0.1.5
```

## 常见问题

### NPM 发布失败

**错误 1：版本已存在**
```
npm error You cannot publish over the previously published versions: 0.1.4
```
解决：更新 package.json 中的 version 字段

**错误 2：需要 2FA**
```
Two-factor authentication or granular access token with bypass 2fa enabled is required
```
解决：配置具有 bypass 2fa 权限的 NPM token

### MCP 发布失败

**错误 1：description 过长**
```
expected length <= 100
```
解决：缩短 description 到 100 字符以内

**错误 2：NPM 包不存在**
```
NPM package '@frank-x/dailyhot-mcp' not found
```
解决：先执行 `npm publish` 发布 NPM 包

**错误 3：缺少 mcpName**
```
NPM package is missing required 'mcpName' field
```
解决：在 package.json 中添加 `"mcpName": "io.github.FrankXMX/dailyhotmcp"`

**错误 4：权限不足**
```
You do not have permission to publish this server
```
解决：`name` 必须匹配你的 MCP 注册表权限范围（如 `io.github.FrankXMX/*`）

**错误 5：Token 过期**
```
Invalid or expired Registry JWT token
```
解决：重新登录 `mcp-publisher login`

### 删除已发布的版本

如果需要重新发布，可以先删除旧版本：

```bash
mcp-publisher status --status deleted --all-versions --message "Re-publishing" io.github.FrankXMX/dailyhotmcp
```

## 相关链接

- NPM 包：https://www.npmjs.com/package/@frank-x/dailyhot-mcp
- MCP 注册表：https://modelcontextprotocol.io
- GitHub 仓库：https://github.com/FrankXMX/dailyhotmcp