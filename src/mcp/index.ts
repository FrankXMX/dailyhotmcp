import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import type { RouterData } from "../types.js";

// 从 package.json 动态读取版本号
function getVersion(): string {
  try {
    // 获取当前文件所在目录
    const __dirname = dirname(fileURLToPath(import.meta.url));
    // 尝试多个可能的 package.json 路径
    const possiblePaths = [
      resolve(__dirname, "../../package.json"), // npm 包安装后: dist/mcp/ -> 项目根目录
      resolve(__dirname, "../package.json"), // 开发时: src/mcp/ -> src/
      resolve(__dirname, "../../../package.json"), // 其他可能的嵌套结构
    ];
    for (const packageJsonPath of possiblePaths) {
      try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        if (pkg.version) return pkg.version;
      } catch {
        // 继续尝试下一个路径
      }
    }
  } catch {
    // 忽略错误
  }
  return "0.0.0";
}

const VERSION = getVersion();

const mcpServer = new McpServer({
  name: "dailyhot-mcp",
  version: VERSION,
});

console.error("MCP Server initializing...");

const createMockContext = (params: Record<string, any> = {}): any => ({
  req: {
    query: (key: string) => String(params[key] || ""),
  },
});

const baseInputSchema = z.object({
  limit: z.number().optional(),
  noCache: z.boolean().default(false),
});

const platforms = [
  {
    name: "bilibili",
    title: "哔哩哔哩",
    description: "获取哔哩哔哩热门视频排行榜",
    route: "bilibili",
  },
  { name: "weibo", title: "微博", description: "获取微博热搜榜数据", route: "weibo" },
  { name: "zhihu", title: "知乎", description: "获取知乎热榜数据", route: "zhihu" },
  { name: "zhihu-daily", title: "知乎日报", description: "获取知乎日报推荐", route: "zhihu-daily" },
  { name: "douyin", title: "抖音", description: "获取抖音热点榜数据", route: "douyin" },
  { name: "baidu", title: "百度", description: "获取百度热搜榜数据", route: "baidu" },
  { name: "toutiao", title: "今日头条", description: "获取今日头条热榜数据", route: "toutiao" },
  { name: "tieba", title: "百度贴吧", description: "获取百度贴吧热议榜数据", route: "tieba" },
  { name: "kuaishou", title: "快手", description: "获取快手热点榜数据", route: "kuaishou" },
  { name: "36kr", title: "36Kr", description: "获取36Kr热榜数据", route: "36kr" },
  { name: "csdn", title: "CSDN", description: "获取CSDN热榜数据", route: "csdn" },
  { name: "juejin", title: "稀土掘金", description: "获取掘金热榜数据", route: "juejin" },
  { name: "v2ex", title: "V2EX", description: "获取V2EX热榜数据", route: "v2ex" },
  { name: "github", title: "GitHub", description: "获取GitHub热门项目", route: "github" },
  { name: "jianshu", title: "简书", description: "获取简书热门推荐", route: "jianshu" },
  { name: "sspai", title: "少数派", description: "获取少数派热榜数据", route: "sspai" },
  { name: "ithome", title: "IT之家", description: "获取IT之家热榜数据", route: "ithome" },
  {
    name: "ithome-xijiayi",
    title: "IT之家喜加一",
    description: "获取IT之家喜加一信息",
    route: "ithome-xijiayi",
  },
  { name: "guokr", title: "果壳", description: "获取果壳热门文章", route: "guokr" },
  { name: "thepaper", title: "澎湃新闻", description: "获取澎湃新闻热榜", route: "thepaper" },
  {
    name: "netease-news",
    title: "网易新闻",
    description: "获取网易新闻热点榜",
    route: "netease-news",
  },
  { name: "qq-news", title: "腾讯新闻", description: "获取腾讯新闻热点榜", route: "qq-news" },
  { name: "sina", title: "新浪", description: "获取新浪热榜数据", route: "sina" },
  { name: "sina-news", title: "新浪新闻", description: "获取新浪新闻热点榜", route: "sina-news" },
  { name: "huxiu", title: "虎嗅", description: "获取虎嗅24小时热榜", route: "huxiu" },
  { name: "coolapk", title: "酷安", description: "获取酷安热榜数据", route: "coolapk" },
  { name: "hupu", title: "虎扑", description: "获取虎扑步行街热帖", route: "hupu" },
  { name: "ifanr", title: "爱范儿", description: "获取爱范儿快讯", route: "ifanr" },
  { name: "lol", title: "英雄联盟", description: "获取英雄联盟更新公告", route: "lol" },
  { name: "miyoushe", title: "米游社", description: "获取米游社最新消息", route: "miyoushe" },
  { name: "genshin", title: "原神", description: "获取原神最新消息", route: "genshin" },
  { name: "honkai", title: "崩坏3", description: "获取崩坏3最新动态", route: "honkai" },
  {
    name: "starrail",
    title: "崩坏星穹铁道",
    description: "获取星穹铁道最新动态",
    route: "starrail",
  },
  { name: "weread", title: "微信读书", description: "获取微信读书飙升榜", route: "weread" },
  { name: "ngabbs", title: "NGA", description: "获取NGA热帖数据", route: "ngabbs" },
  {
    name: "hellogithub",
    title: "HelloGitHub",
    description: "获取GitHub Trending",
    route: "hellogithub",
  },
  { name: "acfun", title: "AcFun", description: "获取AcFun排行榜数据", route: "acfun" },
  { name: "douban-movie", title: "豆瓣电影", description: "获取豆瓣新片榜", route: "douban-movie" },
  {
    name: "douban-group",
    title: "豆瓣小组",
    description: "获取豆瓣小组精选",
    route: "douban-group",
  },
  { name: "52pojie", title: "吾爱破解", description: "获取吾爱破解榜单", route: "52pojie" },
  { name: "hostloc", title: "全球主机交流", description: "获取HostLoc榜单", route: "hostloc" },
  {
    name: "weatheralarm",
    title: "气象预警",
    description: "获取中央气象预警",
    route: "weatheralarm",
  },
  {
    name: "earthquake",
    title: "地震速报",
    description: "获取中国地震台网速报",
    route: "earthquake",
  },
  { name: "history", title: "历史上的今天", description: "获取历史上的今天", route: "history" },
  { name: "51cto", title: "51CTO", description: "获取51CTO推荐榜", route: "51cto" },
  { name: "nytimes", title: "纽约时报", description: "获取纽约时报热榜", route: "nytimes" },
  {
    name: "producthunt",
    title: "Product Hunt",
    description: "获取Product Hunt热榜",
    route: "producthunt",
  },
  {
    name: "hackernews",
    title: "Hacker News",
    description: "获取Hacker News热榜",
    route: "hackernews",
  },
  { name: "linuxdo", title: "Linux.do", description: "获取Linux.do热榜", route: "linuxdo" },
  { name: "newsmth", title: "水源木土", description: "获取水木社区热榜", route: "newsmth" },
  { name: "gameres", title: "游民星空", description: "获取游民星空热榜", route: "gameres" },
  { name: "geekpark", title: "极客公园", description: "获取极客公园热榜", route: "geekpark" },
  { name: "smzdm", title: "什么值得买", description: "获取什么值得买热榜", route: "smzdm" },
  { name: "dgtle", title: "数码窝", description: "获取数码窝热榜", route: "dgtle" },
  { name: "yystv", title: "YY", description: "获取YY热榜", route: "yystv" },
];

async function registerPlatformTool(platform: (typeof platforms)[0]) {
  const { handleRoute } = await import(`../routes/${platform.route}.js`);

  mcpServer.registerTool(
    platform.name,
    {
      title: platform.title,
      description: platform.description,
      inputSchema: baseInputSchema,
    },
    async (params) => {
      const { limit, noCache = false } = params;
      try {
        const ctx = createMockContext(params);
        const result: RouterData = await handleRoute(ctx, noCache);

        let data = result.data;
        if (limit && data.length > limit) {
          data = data.slice(0, limit);
        }

        const prompt = `请以友好的格式展示「${result.title}」榜单，包含：标题、热度值、原文链接。使用列表格式，每条包含序号、标题、热度、链接（使用 mobileUrl 字段）。`;

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                code: 200,
                name: result.name,
                title: result.title,
                type: result.type,
                description: result.description,
                total: data.length,
                data: data,
                updateTime: result.updateTime,
                fromCache: result.fromCache,
                prompt,
              }),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`MCP ${platform.name} tool error: ${errorMessage}`);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                code: 500,
                message: errorMessage,
              }),
            },
          ],
          isError: true,
        };
      }
    },
  );
}

// 注册获取平台列表的工具
mcpServer.registerTool(
  "list_platforms",
  {
    title: "平台列表",
    description: "获取所有可用的热门榜单平台",
    inputSchema: z.object({}),
  },
  async () => {
    const platformList = platforms.map((p) => ({
      name: p.name,
      title: p.title,
      description: p.description,
      route: p.route,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            code: 200,
            total: platformList.length,
            data: platformList,
          }),
        },
      ],
    };
  },
);

async function main() {
  try {
    logger.info("Starting DailyHot MCP Server...");

    for (const platform of platforms) {
      await registerPlatformTool(platform);
      logger.info(`Registered ${platform.name} tool`);
    }

    logger.info(`Registered ${platforms.length} platform tools`);

    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);

    // 通知客户端服务器已就绪
    console.error("MCP Server ready");

    logger.info("MCP Server running via stdio (use with MCP client)");
  } catch (error) {
    logger.error(`MCP Server error: ${error}`);
    process.exit(1);
  }
}

export { mcpServer, main };

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
