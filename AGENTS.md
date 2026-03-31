# DailyHotMCP - Agent Guidelines

## Project Overview

A hot list aggregation MCP Server built with TypeScript. Provides 56 Chinese platform hot list data via MCP (Model Context Protocol) tool calls.

## Tech Stack

- **Runtime**: Node.js >= 20 (ES modules)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP Client**: Axios
- **Logging**: Winston
- **Caching**: Redis + NodeCache
- **Linting**: ESLint + Prettier

---

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run MCP Server (via stdio)
node dist/index.js

# Code quality
pnpm lint
pnpm format
```

### Using with MCP Clients

The MCP Server communicates via stdio. Configure your MCP client to spawn:

```bash
node dist/index.js
```

---

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** — no implicit any, strict null checks
- **Explicit types** for public APIs and exported functions
- **Interfaces** for object shapes that may be extended
- **Types** for unions, intersections, and utility types
- **Avoid `any`** — use `unknown` with type narrowing when needed
- **No `enum`** — use string literal unions instead

### Naming Conventions

| Element    | Convention | Example                      |
| ---------- | ---------- | ---------------------------- |
| Files      | kebab-case | `bilibili.ts`, `get-data.ts` |
| Routes     | kebab-case | `weibo.ts`, `zhihu-daily.ts` |
| Functions  | camelCase  | `getList`, `handleRoute`     |
| Interfaces | PascalCase | `RouterData`, `ListItem`     |
| Types      | camelCase  | `RouterResType`, `Options`   |
| Constants  | camelCase  | `config.PORT`, `typeMap`     |

### Imports

```typescript
import type { RouterData } from "../types.js";
import { get } from "../utils/getData.js";
```

### Formatting (Prettier)

```javascript
{
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  printWidth: 100
}
```

---

## Project Structure

```
src/
├── index.ts          # Entry point (runs MCP server)
├── config.ts         # Environment config with validation
├── types.d.ts        # Shared TypeScript interfaces
├── mcp/
│   ├── index.ts      # MCP Server with tool registration
│   └── tools.ts      # Tool helper functions
├── routes/           # Platform data sources (56 files)
│   ├── bilibili.ts
│   ├── weibo.ts
│   └── ...
└── utils/
    ├── getData.ts    # HTTP GET/POST with caching
    ├── cache.ts      # Redis + NodeCache abstraction
    ├── logger.ts     # Winston logger
    └── ...
```

---

## MCP Tools

The server exposes 56 tools, one for each platform:

| Tool Name | Platform |
| --------- | -------- |
| bilibili  | 哔哩哔哩 |
| weibo     | 微博     |
| zhihu     | 知乎     |
| douyin    | 抖音     |
| baidu     | 百度     |
| ...       | ...      |

### Tool Parameters

All tools accept:

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
  description: "Description",
  total: number,
  data: [
    {
      id: string,
      title: string,
      cover?: string,
      author?: string,
      desc?: string,
      hot: number,
      url: string,
      mobileUrl: string
    }
  ],
  updateTime: string,
  fromCache: boolean
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
