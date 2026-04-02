<div align="center">
<h2>今日热榜</h2>
<p>一个聚合热门数据的 MCP 服务</p>
<br />
<a href="https://github.com/FrankXMX/dailyhotmcp/stargazers">
<img src="https://img.shields.io/github/stars/FrankXMX/dailyhotmcp?style=social" alt="GitHub stars"/>
</a>
<a href="https://github.com/FrankXMX/dailyhotmcp/fork">
<img src="https://img.shields.io/github/forks/FrankXMX/dailyhotmcp?style=social" alt="GitHub forks"/>
</a>
<a href="https://www.npmjs.com/package/@frank-x/dailyhot-mcp">
<img src="https://img.shields.io/npm/v/@frank-x/dailyhot-mcp" alt="npm version"/>
</a>
</div>

## 特性

- 支持 MCP 协议，可直接集成到 Claude Desktop、Cursor 等 AI 助手
- 极快响应，便于开发
- 支持 RSS 模式和 JSON 模式
- 支持多种部署方式
- 简明的路由目录，便于新增

## 快速开始

### MCP 使用

本项目发布在 [MCP 注册表](https://modelcontextprotocol.io registry)，支持以下客户端：

#### Claude Code / OpenCLAW / VSCode (Claude 扩展)

在 VSCode 设置中添加 MCP 服务器配置：

```json
{
  "mcpServers": {
    "dailyhot": {
      "command": "npx",
      "args": ["-y", "@frank-x/dailyhot-mcp@latest"]
    }
  }
}
```

重启后即可对话使用，支持 50+ 平台热门数据查询，如：
```
获取微博热搜榜前10条数据
获取 B 站热门视频
```

#### OpenCode

在 OpenCode 配置文件 `opencode.json` 中添加：

```json
{
  "mcp": {
    "dailyhot": {
      "type": "local",
      "command": ["npx", "-y", "@frank-x/dailyhot-mcp@latest"]
    }
  }
}
```

#### 其他 MCP 客户端
同样配置即可使用。

### 作为 npm 包使用

```bash
pnpm add @frank-x/dailyhot-mcp
```

```js
import { main } from "@frank-x/dailyhot-mcp";

/**
 * 启动 MCP 服务（stdio 模式）
 * @returns {Promise<void>}
 */
main();
```

## 接口总览

> 项目支持 50+ 平台热门数据，可通过 MCP 工具或 npm 包调用。

<details>
<summary>查看支持的平台</summary>

| **站点**       | **类别**   | **调用名称** | **站点**     | **类别**   | **调用名称** |
| ---------------| ---------- | ------------ | -------------| ---------- | ------------ |
| 哔哩哔哩       | 热门榜     | bilibili     | 知乎         | 热榜       | zhihu       |
| 微博           | 热搜榜     | weibo        | 知乎日报     | 推荐榜     | zhihu-daily |
| 百度           | 热搜榜     | baidu        | 抖音         | 热点榜     | douyin      |
| 快手           | 热点榜     | kuaishou     | 豆瓣电影     | 新片榜     | douban-movie|
| 豆瓣讨论小组   | 讨论精选   | douban-group | 百度贴吧     | 热议榜     | tieba       |
| 少数派         | 热榜       | sspai        | IT之家       | 热榜       | ithome      |
| IT之家喜加一   | 最新动态   | ithome-xijiayi | 简书        | 热门推荐   | jianshu     |
| 果壳           | 热门文章   | guokr        | 澎湃新闻     | 热榜       | thepaper    |
| 今日头条       | 热榜       | toutiao      | 36 氪        | 热榜       | 36kr        |
| 51CTO          | 推荐榜     | 51cto        | CSDN         | 排行榜     | csdn        |
| NodeSeek       | 最新动态   | nodeseek     | 稀土掘金     | 热榜       | juejin      |
| 腾讯新闻       | 热点榜     | qq-news      | 新浪网       | 热榜       | sina        |
| 新浪新闻       | 热点榜     | sina-news    | 网易新闻     | 热点榜     | netease-news|
| 吾爱破解       | 榜单       | 52pojie      | 全球主机交流 | 榜单       | hostloc     |
| 虎嗅           | 24小时     | huxiu        | 酷安         | 热榜       | coolapk     |
| 虎扑           | 步行街热帖 | hupu         | 爱范儿       | 快讯       | ifanr       |
| 英雄联盟       | 更新公告   | lol          | 米游社       | 最新消息   | miyoushe    |
| 原神           | 最新消息   | genshin      | 崩坏3        | 最新动态   | honkai      |
| 崩坏星穹铁道   | 最新动态   | starrail     | 微信读书     | 飙升榜     | weread      |
| NGA            | 热帖       | ngabbs       | V2EX         | 主题榜     | v2ex        |
| HelloGitHub    | Trending   | hellogithub  | 中央气象预警 | 全国气象预警 | weatheralarm |
| 中国地震台     | 地震速报   | earthquake   | 历史上的今天 | 月-日      | history     |
| AcFun          | 排行榜     | acfun        | Hacker News  | 热榜       | hackernews  |
| Product Hunt   | 热榜       | producthunt  | 纽约时报     | 热榜       | nytimes     |
| Linux.do       | 热榜       | linuxdo      | 游民星空     | 热榜       | gameres     |
| 极客公园       | 热榜       | geekpark     | 什么值得买   | 热榜       | smzdm       |
| 数码窝         | 热榜       | dgtle        | YY           | 热榜       | yystv       |
| 水木社区       | 热榜       | newsmth      |              |            |             |

</details>

## 部署

### Docker 部署

```bash
# 构建
docker build -t dailyhot-mcp .

# 运行
docker run --restart always -p 6688:6688 -d dailyhot-mcp
# 或使用 Docker Compose
docker-compose up -d
```

### 手动部署

```bash
git clone https://github.com/FrankXMX/dailyhotmcp.git
cd dailyhotmcp
pnpm install
```

复制 `.env.example` 为 `.env` 并修改配置。

#### 开发

```bash
pnpm dev
```

#### 编译运行

```bash
pnpm build
pnpm start
```

### pm2 部署

```bash
pnpm i pm2 -g
pnpm build
sh ./deploy.sh
```

## 须知

- 默认缓存 60 分钟，可在 `.env` 中修改 `CACHE_TTL`
- 部分接口使用页面爬虫，若违反对应页面规则请联系移除

## 免责声明

- 本项目服务仅供技术研究和开发测试使用
- 获取的信息来自公开渠道，不对准确性作出承诺
- 使用本项目产生的法律责任由使用者自行承担

## 鸣谢

- [RSSHub](https://github.com/DIYgod/RSSHub)
- [DailyHotApi](https://github.com/imsyy/DailyHotApi)

