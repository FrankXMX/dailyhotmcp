<div align="center">
<img alt="logo" height="120" src="./public/favicon.png" width="120"/>
<h2>今日热榜</h2>
<p>一个聚合热门数据的 API 接口 | 支持 MCP 协议</p>
<br />
[![GitHub stars](https://img.shields.io/github/stars/FrankXMX/dailyhotmcp?style=social)](https://github.com/FrankXMX/dailyhotmcp)
[![GitHub forks](https://img.shields.io/github/forks/FrankXMX/dailyhotmcp?style=social)](https://github.com/FrankXMX/dailyhotmcp)
[![npm version](https://img.shields.io/npm/v/@frank-x/dailyhot-mcp)](https://www.npmjs.com/package/@frank-x/dailyhot-mcp)
</div>

## 特性

- 支持 MCP 协议，可直接集成到 Claude Desktop、Cursor 等 AI 助手
- 极快响应，便于开发
- 支持 RSS 模式和 JSON 模式
- 支持多种部署方式
- 简明的路由目录，便于新增

## 快速开始

### MCP 使用

#### Claude Desktop
在 `~/Library/Application Support/Claude/claude_desktop_config.json` 添加：

```json
{
  "mcpServers": {
    "dailyhot": {
      "command": "npx",
      "args": ["-y", "dailyhot-mcp"]
    }
  }
}
```

重启 Claude Desktop 后即可使用，如：
```
获取微博热搜榜前10条数据
获取 B 站热门视频
```

#### Cursor / 其他 MCP 客户端
同样配置即可使用，支持 50+ 平台热门数据查询。

### HTTP API

```bash
# 获取微博热搜
curl https://api-hot.imsyy.top/weibo

# 获取 B 站热门
curl https://api-hot.imsyy.top/bilibili
```

### 作为 npm 包使用

```bash
pnpm add dailyhot-mcp
```

```js
import serveHotApi from "dailyhot-mcp";

/**
 * 启动服务器
 * @param {Number} [port] - 端口号
 * @returns {Promise<void>}
 */
serveHotApi(3000);
```

## 接口总览

<details>
<summary>查看全部接口</summary>

> 示例站点运行于海外服务器，部分国内站点可能存在访问异常，请以实际情况为准

| **站点**         | **类别**     | **调用名称**   | **状态**                                                                                                                                                            |
| ---------------- | ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 哔哩哔哩         | 热门榜       | bilibili       | ![https://api-hot.imsyy.top/bilibili](https://img.shields.io/website.svg?label=bilibili&url=https://api-hot.imsyy.top/bilibili&cacheSeconds=7200)                   |
| AcFun            | 排行榜       | acfun          | ![https://api-hot.imsyy.top/acfun](https://img.shields.io/website.svg?label=acfun&url=https://api-hot.imsyy.top/acfun&cacheSeconds=7200)                            |
| 微博             | 热搜榜       | weibo          | ![https://api-hot.imsyy.top/weibo](https://img.shields.io/website.svg?label=weibo&url=https://api-hot.imsyy.top/weibo&cacheSeconds=7200)                            |
| 知乎             | 热榜         | zhihu          | ![https://api-hot.imsyy.top/zhihu](https://img.shields.io/website.svg?label=zhihu&url=https://api-hot.imsyy.top/zhihu&cacheSeconds=7200)                            |
| 知乎日报         | 推荐榜       | zhihu-daily    | ![https://api-hot.imsyy.top/zhihu-daily](https://img.shields.io/website.svg?label=zhihu-daily&url=https://api-hot.imsyy.top/zhihu-daily&cacheSeconds=7200)          |
| 百度             | 热搜榜       | baidu          | ![https://api-hot.imsyy.top/baidu](https://img.shields.io/website.svg?label=baidu&url=https://api-hot.imsyy.top/baidu&cacheSeconds=7200)                            |
| 抖音             | 热点榜       | douyin         | ![https://api-hot.imsyy.top/douyin](https://img.shields.io/website.svg?label=douyin&url=https://api-hot.imsyy.top/douyin&cacheSeconds=7200)                         |
| 快手             | 热点榜       | kuaishou       | ![https://api-hot.imsyy.top/kuaishou](https://img.shields.io/website.svg?label=kuaishou&url=https://api-hot.imsyy.top/kuaishou&cacheSeconds=7200)                   |
| 豆瓣电影         | 新片榜       | douban-movie   | ![https://api-hot.imsyy.top/douban-movie](https://img.shields.io/website.svg?label=douban-movie&url=https://api-hot.imsyy.top/douban-movie&cacheSeconds=7200)       |
| 豆瓣讨论小组     | 讨论精选     | douban-group   | ![https://api-hot.imsyy.top/douban-group](https://img.shields.io/website.svg?label=douban-group&url=https://api-hot.imsyy.top/douban-group&cacheSeconds=7200)       |
| 百度贴吧         | 热议榜       | tieba          | ![https://api-hot.imsyy.top/tieba](https://img.shields.io/website.svg?label=tieba&url=https://api-hot.imsyy.top/tieba&cacheSeconds=7200)                            |
| 少数派           | 热榜         | sspai          | ![https://api-hot.imsyy.top/sspai](https://img.shields.io/website.svg?label=sspai&url=https://api-hot.imsyy.top/sspai&cacheSeconds=7200)                            |
| IT之家           | 热榜         | ithome         | ![https://api-hot.imsyy.top/ithome](https://img.shields.io/website.svg?label=ithome&url=https://api-hot.imsyy.top/ithome&cacheSeconds=7200)                         |
| IT之家「喜加一」 | 最新动态     | ithome-xijiayi | ![https://api-hot.imsyy.top/ithome-xijiayi](https://img.shields.io/website.svg?label=ithome-xijiayi&url=https://api-hot.imsyy.top/ithome-xijiayi&cacheSeconds=7200) |
| 简书             | 热门推荐     | jianshu        | ![https://api-hot.imsyy.top/jianshu](https://img.shields.io/website.svg?label=jianshu&url=https://api-hot.imsyy.top/jianshu&cacheSeconds=7200)                      |
| 果壳             | 热门文章     | guokr          | ![https://api-hot.imsyy.top/guokr](https://img.shields.io/website.svg?label=guokr&url=https://api-hot.imsyy.top/guokr&cacheSeconds=7200)                            |
| 澎湃新闻         | 热榜         | thepaper       | ![https://api-hot.imsyy.top/thepaper](https://img.shields.io/website.svg?label=thepaper&url=https://api-hot.imsyy.top/thepaper&cacheSeconds=7200)                   |
| 今日头条         | 热榜         | toutiao        | ![https://api-hot.imsyy.top/toutiao](https://img.shields.io/website.svg?label=toutiao&url=https://api-hot.imsyy.top/toutiao&cacheSeconds=7200)                      |
| 36 氪            | 热榜         | 36kr           | ![https://api-hot.imsyy.top/36kr](https://img.shields.io/website.svg?label=36kr&url=https://api-hot.imsyy.top/36kr&cacheSeconds=7200)                               |
| 51CTO            | 推荐榜       | 51cto          | ![https://api-hot.imsyy.top/51cto](https://img.shields.io/website.svg?label=51cto&url=https://api-hot.imsyy.top/51cto&cacheSeconds=7200)                            |
| CSDN             | 排行榜       | csdn           | ![https://api-hot.imsyy.top/csdn](https://img.shields.io/website.svg?label=csdn&url=https://api-hot.imsyy.top/csdn&cacheSeconds=7200)                               |
| NodeSeek         | 最新动态     | nodeseek       | ![https://api-hot.imsyy.top/nodeseek](https://img.shields.io/website.svg?label=nodeseek&url=https://api-hot.imsyy.top/nodeseek&cacheSeconds=7200)                   |
| 稀土掘金         | 热榜         | juejin         | ![https://api-hot.imsyy.top/juejin](https://img.shields.io/website.svg?label=juejin&url=https://api-hot.imsyy.top/juejin&cacheSeconds=7200)                            |
| 腾讯新闻         | 热点榜       | qq-news        | ![https://api-hot.imsyy.top/qq-news](https://img.shields.io/website.svg?label=qq-news&url=https://api-hot.imsyy.top/qq-news&cacheSeconds=7200)                      |
| 新浪网           | 热榜         | sina           | ![https://api-hot.imsyy.top/sina](https://img.shields.io/website.svg?label=sina&url=https://api-hot.imsyy.top/sina&cacheSeconds=7200)                               |
| 新浪新闻         | 热点榜       | sina-news      | ![https://api-hot.imsyy.top/sina-news](https://img.shields.io/website.svg?label=sina-news&url=https://api-hot.imsyy.top/sina-news&cacheSeconds=7200)                |
| 网易新闻         | 热点榜       | netease-news   | ![https://api-hot.imsyy.top/netease-news](https://img.shields.io/website.svg?label=netease-news&url=https://api-hot.imsyy.top/netease-news&cacheSeconds=7200)       |
| 吾爱破解         | 榜单         | 52pojie        | ![https://api-hot.imsyy.top/52pojie](https://img.shields.io/website.svg?label=52pojie&url=https://api-hot.imsyy.top/52pojie&cacheSeconds=7200)                      |
| 全球主机交流     | 榜单         | hostloc        | ![https://api-hot.imsyy.top/hostloc](https://img.shields.io/website.svg?label=hostloc&url=https://api-hot.imsyy.top/hostloc&cacheSeconds=7200)                      |
| 虎嗅             | 24小时       | huxiu          | ![https://api-hot.imsyy.top/huxiu](https://img.shields.io/website.svg?label=huxiu&url=https://api-hot.imsyy.top/huxiu&cacheSeconds=7200)                            |
| 酷安             | 热榜         | coolapk        | ![https://api-hot.imsyy.top/coolapk](https://img.shields.io/website.svg?label=coolapk&url=https://api-hot.imsyy.top/coolapk&cacheSeconds=7200)                      |
| 虎扑             | 步行街热帖   | hupu           | ![https://api-hot.imsyy.top/hupu](https://img.shields.io/website.svg?label=hupu&url=https://api-hot.imsyy.top/hupu&cacheSeconds=7200)                               |
| 爱范儿           | 快讯         | ifanr          | ![https://api-hot.imsyy.top/ifanr](https://img.shields.io/website.svg?label=ifanr&url=https://api-hot.imsyy.top/ifanr&cacheSeconds=7200)                            |
| 英雄联盟         | 更新公告     | lol            | ![https://api-hot.imsyy.top/lol](https://img.shields.io/website.svg?label=lol&url=https://api-hot.imsyy.top/lol&cacheSeconds=7200)                                  |
| 米游社           | 最新消息     | miyoushe       | ![https://api-hot.imsyy.top/miyoushe](https://img.shields.io/website.svg?label=miyoushe&url=https://api-hot.imsyy.top/miyoushe&cacheSeconds=7200)                   |
| 原神             | 最新消息     | genshin        | ![https://api-hot.imsyy.top/genshin](https://img.shields.io/website.svg?label=genshin&url=https://api-hot.imsyy.top/genshin&cacheSeconds=7200)                      |
| 崩坏3            | 最新动态     | honkai         | ![https://api-hot.imsyy.top/honkai](https://img.shields.io/website.svg?label=honkai&url=https://api-hot.imsyy.top/honkai&cacheSeconds=7200)                         |
| 崩坏：星穹铁道   | 最新动态     | starrail       | ![https://api-hot.imsyy.top/starrail](https://img.shields.io/website.svg?label=starrail&url=https://api-hot.imsyy.top/starrail&cacheSeconds=7200)                   |
| 微信读书         | 飙升榜       | weread         | ![https://api-hot.imsyy.top/weread](https://img.shields.io/website.svg?label=weread&url=https://api-hot.imsyy.top/weread&cacheSeconds=7200)                         |
| NGA              | 热帖         | ngabbs         | ![https://api-hot.imsyy.top/ngabbs](https://img.shields.io/website.svg?label=ngabbs&url=https://api-hot.imsyy.top/ngabbs&cacheSeconds=7200)                         |
| V2EX             | 主题榜       | v2ex           | ![https://api-hot.imsyy.top/v2ex](https://img.shields.io/website.svg?label=v2ex&url=https://api-hot.imsyy.top/v2ex&cacheSeconds=7200)                               |
| HelloGitHub      | Trending     | hellogithub    | ![https://api-hot.imsyy.top/hellogithub](https://img.shields.io/website.svg?label=hellogithub&url=https://api-hot.imsyy.top/hellogithub&cacheSeconds=7200)          |
| 中央气象台       | 全国气象预警 | weatheralarm   | ![https://api-hot.imsyy.top/weatheralarm](https://img.shields.io/website.svg?label=weatheralarm&url=https://api-hot.imsyy.top/weatheralarm&cacheSeconds=7200)       |
| 中国地震台       | 地震速报     | earthquake     | ![https://api-hot.imsyy.top/earthquake](https://img.shields.io/website.svg?label=earthquake&url=https://api-hot.imsyy.top/earthquake&cacheSeconds=7200)             |
| 历史上的今天     | 月-日        | history        | ![https://api-hot.imsyy.top/history](https://img.shields.io/website.svg?label=history&url=https://api-hot.imsyy.top/history&cacheSeconds=7200)                      |

</details>

## 部署

### Docker 部署

#### 本地构建

```bash
# 构建
docker build -t dailyhot-mcp .

# 运行
docker run --restart always -p 6688:6688 -d dailyhot-mcp
# 或使用 Docker Compose
docker-compose up -d
```

#### 在线部署

```bash
# 拉取
docker pull imsyy/dailyhot-mcp:latest

# 运行
docker run --restart always -p 6688:6688 -d imsyy/dailyhot-mcp:latest
```

### 手动部署

```bash
git clone https://github.com/FrankXMX/dailyhotmcp.git
cd dailyhotmcp
npm install
```

复制 `.env.example` 为 `.env` 并修改配置。

#### 开发

```bash
npm run dev
```

#### 编译运行

```bash
npm run build
npm run start
```

### pm2 部署

```bash
npm i pm2 -g
sh ./deploy.sh
```

### Railway / Zeabur 部署

fork 本仓库后即可使用一键部署。

## 须知

- 默认缓存 60 分钟，可在 `.env` 中修改 `CACHE_TTL`
- 部分接口使用页面爬虫，若违反对应页面规则请联系移除

## 免责声明

- 本项目 API 仅供技术研究和开发测试使用
- 获取的信息来自公开渠道，不对准确性作出承诺
- 使用本 API 产生的法律责任由使用者自行承担

## 鸣谢

- [RSSHub](https://github.com/DIYgod/RSSHub)
- [DailyHotApi](https://github.com/imsyy/DailyHotApi)

