# DailyHotMCP - Agent 指南

## 项目概览

一个使用 TypeScript 构建的热点聚合 MCP 服务器。通过 MCP (模型上下文协议) 工具调用提供 58 个平台的热点数据。

## 技术栈

- **运行时**: Node.js >= 20 (ES 模块)
- **语言**: TypeScript (严格模式)
- **包管理器**: pnpm
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP 客户端**: Axios
- **日志**: Winston
- **缓存**: Redis + NodeCache
- **代码质量**: ESLint (扁平配置) + Prettier

---

## 构建 & 开发命令

```bash
# 安装依赖
pnpm install

# 构建 TypeScript 到 dist/
pnpm build

# 开发（带热重载，缓存禁用）
pnpm dev

# 开发（带热重载，缓存启用）
pnpm dev:cache

# 运行生产构建
pnpm start

# 代码质量
pnpm lint          # ESLint 检查
pnpm format        # Prettier 格式化
```

### 测试

**未配置测试框架。** 代码库中没有测试文件或测试脚本。如果添加测试，请使用 vitest 或 jest 并在 package.json 中添加适当的脚本。

### 与 MCP 客户端使用

支持两种模式：

**Stdio 模式**（默认）:
```bash
node dist/index.js
```

**HTTP + SSE 模式**:
```bash
node dist/index.js --http
# 或
MCP_HTTP=1 node dist/index.js
```

HTTP 端点：`POST /mcp`、`GET /mcp`、`GET /health`

---

## 代码风格指南

### TypeScript

- **启用严格模式** — 不允许隐式 any，启用严格 null 检查
- **公共 API 和导出函数使用显式类型**
- **使用接口** 表示可能被扩展的对象形状
- **使用类型** 表示联合、交叉和工具类型
- **避免 `any`** — 使用 `unknown` 并进行类型收窄时需要
- **不使用 `enum`** — 使用字符串字面量联合代替

### 命名约定

| 元素    | 约定 | 示例                      |
| ------- | ---- | ------------------------- |
| 文件    | kebab-case | `bilibili.ts`, `get-data.ts` |
| 函数    | camelCase  | `getList`, `handleRoute`     |
| 接口    | PascalCase | `RouterData`, `ListItem`     |
| 类型    | camelCase  | `RouterResType`, `Options`   |
| 常量    | camelCase  | `config.PORT`, `typeMap`     |

### 导入

```typescript
import type { RouterData, ListContext, Options } from "../types.js";
import { get, post } from "../utils/getData.js";
import logger from "../utils/logger.js";
```

- 始终使用 `.js` 扩展名进行相对导入（ES 模块要求）
- 使用 `import type` 进行仅类型导入
- logger 使用默认导入，工具函数使用命名导入

### 格式化 (Prettier)

```javascript
{
  singleQuote: false,       // 优先使用双引号
  trailingComma: "all",     // 所有位置都使用尾随逗号
  tabWidth: 2,              // 2 空格缩进
  semi: true,               // 需要分号
  printWidth: 100           // 行宽限制
}
```

### 错误处理

```typescript
try {
  const result = await someAsyncOperation();
} catch (error) {
  logger.error(`操作失败: ${error instanceof Error ? error.message : "未知错误"}`);
  throw error; // 或者返回结构化错误响应
}
```

- 对所有日志使用 Winston logger（导入默认导出）
- 使用 `instanceof Error` 检查进行类型安全的错误处理
- 错误向上传播或转换为结构化错误响应

### 路由模式

```typescript
export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList(options, noCache);
  return { name, title, type, total, ...listData };
};
```

### HTTP 客户端模式

```typescript
const response = await get<ResponseType>({
  url: "https://api.example.com/data",
  headers: { "User-Agent": "..." },
});
```

- 使用 `utils/getData.js` 中的 `get()` 和 `post()` 函数
- 内置缓存通过 Redis/NodeCache
- 泛型类型支持: `get<T>()`

---

## Project Structure

```
src/
├── index.ts          # Entry point (runs MCP server)
├── config.ts         # Environment config with validation
├── types.d.ts        # Shared TypeScript interfaces
├── mcp/
│   └── index.ts      # MCP Server with tool registration
├── routes/           # Platform data sources (58 files)
│   ├── bilibili.ts
│   └── ...
└── utils/
    ├── getData.ts    # HTTP GET/POST with caching
    ├── cache.ts      # Redis + NodeCache abstraction
    ├── logger.ts     # Winston logger
    └── ...
```

---

## MCP Tools

The server exposes 58 tools, one for each platform, plus list_platforms. All tools accept:

```typescript
{
  limit?: number,      // Max items to return
  noCache?: boolean    // Skip cache, fetch fresh data
}
```

### Tool Response Format

```typescript
{
  code: 200,
  name: "platform",
  title: "Platform Name",
  type: "热榜 · Category",
  total: number,
  data: [{ id: string, title: string, hot: number, url: string, ... }],
  updateTime: string,
  fromCache: boolean,
  prompt: string  // 提示大模型如何友好展示给用户
}
```

---

## Adding a New Platform

1. Create `src/routes/{platform-name}.ts` with `handleRoute` export
2. Add platform to `src/mcp/index.ts` platforms array
3. Tool will be automatically registered

---

## Configuration

Environment variables in `.env`:

```bash
PORT=6688                    # Server port
CACHE_TTL=3600              # Cache duration (seconds)
REQUEST_TIMEOUT=6000        # Request timeout (ms)
USE_LOG_FILE=true           # Enable file logging
REDIS_HOST="127.0.0.1"     # Redis host
```
