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
pnpm dev        # 启动开发服务器（热重载）
pnpm build      # 编译 TypeScript 到 dist/
pnpm start      # 运行生产构建
pnpm lint       # 运行 ESLint 检查
pnpm format     # 使用 Prettier 格式化代码
```

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
MCP 服务器在 `src/mcp/index.ts` 中动态注册各平台工具，支持参数：
- `limit?: number` - 限制返回数量
- `noCache?: boolean` - 跳过缓存

### 工具函数
- `src/utils/getData.ts` - 带缓存的 HTTP 客户端
- `src/utils/cache.ts` - Redis/内存缓存封装
- `src/utils/getToken/` - 平台特定 Token 处理（如 B 站 WBI 签名）
