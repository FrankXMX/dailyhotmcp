# CLAUDE.md

本文档为 Claude Code (claude.ai/code) 在本项目中工作时提供指导。

## 项目概述

**DailyHotMCP** 是一个 Node.js API，聚合了 50+ 个国内外平台的热门榜单数据（微博、知乎、B站、GitHub 等）。提供以下功能：
- 各平台的 REST API 接口
- MCP（Model Context Protocol）服务器，支持 AI 集成
- RSS 订阅支持
- Redis/内存缓存

## 常用命令

```bash
pnpm dev         # 启动开发服务器（热重载，默认禁用缓存）
pnpm dev:cache   # 启动开发服务器（热重载，启用缓存）
pnpm build       # 编译 TypeScript 到 dist/
pnpm start       # 运行生产构建
pnpm lint        # 运行 ESLint 检查
pnpm format      # 使用 Prettier 格式化代码
```

## 环境配置

在 `.env` 文件中配置以下环境变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `CACHE_TTL` | 3600 | 缓存时间（秒） |
| `REDIS_HOST` | 127.0.0.1 | Redis 主机地址 |
| `REDIS_PORT` | 6379 | Redis 端口 |
| `REDIS_PASSWORD` | - | Redis 密码 |
| `ZHIHU_COOKIE` | - | 知乎登录 Cookie（获取完整数据） |
| `FILTER_WEIBO_ADVERTISEMENT` | false | 过滤微博广告 |

复制 `.env.example` 为 `.env` 开始配置。

## 架构

### 路由模式
每个平台对应 `src/routes/{平台名}.ts` 文件，结构如下：
```typescript
export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList(options, noCache);
  return { name, title, type, total, ...listData };
};
```

路由必须导出 `handleRoute` 函数，返回包含以下字段的 `RouterData`：
- `name`：平台标识符
- `title/description`：显示名称
- `data`：`ListItem` 数组，包含 id、title、cover、author、hot、url、mobileUrl

### 新增平台
1. 在 `src/routes/{平台名}.ts` 创建路由文件，遵循上述路由模式
2. 在 `src/mcp/index.ts` 的 platforms 数组中添加平台配置

### MCP 工具
MCP 服务器在 [src/mcp/index.ts](src/mcp/index.ts) 中动态注册各平台工具，支持参数：
- `limit?: number` - 限制返回数量
- `noCache?: boolean` - 跳过缓存

每个平台工具调用对应路由的 `handleRoute` 函数，返回 JSON 格式数据。

### MCP 部署
支持两种模式：
1. **Stdio 模式**：作为 MCP 服务器运行（用于 Claude Desktop、Cursor 等 AI 助手）
2. **HTTP API 模式**：通过 `bin/cli.mjs` 或直接导入作为 HTTP API 服务

### 工具函数
- `src/utils/getData.ts` - 带缓存的 HTTP 客户端（get/post 函数）
- `src/utils/cache.ts` - Redis/内存缓存封装
- `src/utils/getToken/` - 平台特定 Token 处理（如 B 站 WBI 签名、微信读书 cookie）
- `src/utils/getTime.ts` - 时间戳转换
- `src/utils/getNum.ts` - 数字格式化
- `src/utils/getRSS.ts` / `parseRSS.ts` - RSS 订阅支持

### 类型定义
所有核心类型定义在 [types.d.ts](src/types.d.ts)：
- `ListContext` - 路由上下文接口
- `ListItem` - 榜单项结构（id, title, cover, author, hot, url, mobileUrl）
- `RouterData` - 路由返回数据结构
- `Get` / `Post` - HTTP 请求选项
