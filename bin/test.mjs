#!/usr/bin/env node
/**
 * DailyHot MCP Test Client
 * 支持 stdio 和 HTTP 两种模式测试 MCP Server
 *
 * 使用方式:
 *   node bin/test.mjs list_tools                           # stdio 模式
 *   node bin/test.mjs call weibo --limit 5                 # stdio 模式
 *   node bin/test.mjs --mode http list_tools               # HTTP 模式
 */

import { spawn } from "node:child_process";
import http from "node:http";

const args = process.argv.slice(2);

function parseArgs() {
  const options = {
    mode: "stdio",
    url: "http://localhost:3000/mcp",
    command: "node",
    serverArgs: ["dist/index.js"],
  };

  const parsedArgs = [];
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === "--mode") {
      options.mode = args[++i];
    } else if (arg === "--url") {
      options.url = args[++i];
    } else if (arg === "--command") {
      options.command = args[++i];
    } else if (arg === "--") {
      options.serverArgs = args.slice(i + 1);
      break;
    } else {
      parsedArgs.push(arg);
    }
    i++;
  }

  options.action = parsedArgs[0] || "help";
  options.toolArgs = parsedArgs.slice(1);

  return options;
}

let requestId = 1;
const pendingRequests = new Map();

// Stdio transport - 完全支持
class StdioTransport {
  constructor(command, serverArgs) {
    this.command = command;
    this.serverArgs = serverArgs;
    this.process = null;
    this.buffer = "";
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.process = spawn(this.command, this.serverArgs, {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env },
      });

      this.process.stdout.on("data", (data) => {
        this.buffer += data.toString();
        this.processBuffer();
      });

      this.process.stderr.on("data", (data) => {
        const msg = data.toString().trim();
        if (msg) {
          console.error("Server:", msg);
        }
      });

      this.process.on("error", reject);
      this.process.on("close", (code) => {
        if (code !== 0 && code !== null) {
          console.error(`Server exited with code ${code}`);
        }
      });

      setTimeout(() => resolve(), 3000);
    });
  }

  processBuffer() {
    const lines = this.buffer.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line) {
        try {
          const response = JSON.parse(line);
          if (response.id && pendingRequests.has(response.id)) {
            const { resolve, reject } = pendingRequests.get(response.id);
            pendingRequests.delete(response.id);
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response.result);
            }
          }
        } catch {
          // Not valid JSON
        }
      }
    }
    this.buffer = lines[lines.length - 1];
  }

  async send(method, params = {}) {
    const id = requestId++;
    const request = JSON.stringify({
      jsonrpc: "2.0",
      id,
      method,
      params,
    });

    this.process.stdin.write(request + "\n");

    return new Promise((resolve, reject) => {
      pendingRequests.set(id, { resolve, reject });
      setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id);
          reject(new Error("Request timeout"));
        }
      }, 30000);
    });
  }

  close() {
    if (this.process) {
      this.process.kill();
    }
  }
}

// HTTP transport - 使用 MCP SDK
class HttpTransport {
  constructor(url) {
    this.url = new URL(url);
    this.client = null;
  }

  async connect() {
    // 尝试使用 MCP SDK
    try {
      const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
      const { StreamableHTTPClientTransport } = await import("@modelcontextprotocol/sdk/client/streamableHttp.js");

      this.client = new Client(
        { name: "dailyhot-test-client", version: "1.0.0" },
        { capabilities: {} }
      );

      const transport = new StreamableHTTPClientTransport(this.url);
      await this.client.connect(transport);
      return;
    } catch (err) {
      console.log("MCP SDK not available:", err.message);
      console.log("\nFor HTTP mode, use the MCP SDK directly:");
      console.log(`
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const client = new Client({ name: "test", version: "1.0.0" }, { capabilities: {} });
await client.connect(new StreamableHTTPClientTransport(new URL("http://localhost:3000/mcp")));
const result = await client.callTool({ name: "weibo", arguments: { limit: 5 } });
`);
      process.exit(1);
    }
  }

  async send(method, params = {}) {
    if (method === "tools/list") {
      return await this.client.request({ method: "tools/list" }, params);
    } else if (method === "tools/call") {
      return await this.client.callTool({
        name: params.name,
        arguments: params.arguments || {},
      });
    }
    throw new Error(`Unsupported method: ${method}`);
  }

  close() {
    if (this.client) {
      this.client.close();
    }
  }
}

async function listTools(transport) {
  const result = await transport.send("tools/list", {});
  console.log("\n=== Available Tools ===\n");
  for (const tool of result.tools) {
    console.log(`  ${tool.name}`);
  }
  console.log(`\nTotal: ${result.tools.length} tools\n`);
}

async function callTool(transport, toolName, toolArgs) {
  const parsedArgs = {};
  for (let i = 0; i < toolArgs.length; i++) {
    const arg = toolArgs[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = toolArgs[i + 1];
      if (value && !value.startsWith("--")) {
        parsedArgs[key] = isNaN(value) ? value : parseInt(value, 10);
        i++;
      } else {
        parsedArgs[key] = true;
      }
    }
  }

  console.log(`\n=== Calling tool: ${toolName} ===`);
  console.log(`Args: ${JSON.stringify(parsedArgs)}\n`);

  const result = await transport.send("tools/call", {
    name: toolName,
    arguments: parsedArgs,
  });

  if (result.content && result.content[0]?.type === "text") {
    try {
      const data = JSON.parse(result.content[0].text);
      console.log("Response:");
      console.log(JSON.stringify(data, null, 2));
    } catch {
      console.log(result.content[0].text);
    }
  } else {
    console.log(result);
  }
}

async function listPlatforms(transport) {
  await callTool(transport, "list_platforms", []);
}

async function main() {
  const options = parseArgs();

  if (!options.action || options.action === "help") {
    console.log(`
DailyHot MCP Test Client

Usage:
  node bin/test.mjs [options] <action> [tool args]

Options:
  --mode <stdio|http>    Connection mode (default: stdio)
  --url <url>            HTTP server URL (default: http://localhost:3000/mcp)
  --command <cmd>        Command to start MCP server (default: node)
  -- <args...>           Arguments passed to server process

Actions:
  list_tools             List all available tools
  list_platforms         List all platforms
  call <name>            Call a specific tool
  help                   Show this help

Examples:
  # Stdio mode (recommended)
  node bin/test.mjs list_tools
  node bin/test.mjs call weibo --limit 5
  node bin/test.mjs --command npx -- -- -y @frank-x/dailyhot-mcp@latest list_tools

  # HTTP mode - requires MCP SDK with compatible zod version
  node dist/index.js --http
  node bin/test.mjs --mode http list_tools
`);
    return;
  }

  let transport;

  try {
    if (options.mode === "stdio") {
      transport = new StdioTransport(options.command, options.serverArgs);
      console.log(`Starting MCP server: ${options.command} ${options.serverArgs.join(" ")}`);
      await transport.connect();
      console.log("Connected to MCP server\n");
    } else if (options.mode === "http") {
      transport = new HttpTransport(options.url);
      console.log(`Connecting to HTTP MCP server: ${options.url}`);
      await transport.connect();
      console.log("Connected to MCP server\n");
    } else {
      console.error(`Unknown mode: ${options.mode}`);
      process.exit(1);
    }

    switch (options.action) {
      case "list_tools":
        await listTools(transport);
        break;
      case "list_platforms":
        await listPlatforms(transport);
        break;
      case "call":
        const toolName = options.toolArgs[0];
        if (!toolName) {
          console.error("Error: tool name required");
          console.error("Usage: node bin/test.mjs call <tool-name> [--limit 5]");
          process.exit(1);
        }
        await callTool(transport, toolName, options.toolArgs.slice(1));
        break;
      default:
        console.error(`Unknown action: ${options.action}`);
        process.exit(1);
    }

    transport.close();
  } catch (error) {
    console.error("Error:", error.message);
    if (transport) transport.close();
    process.exit(1);
  }
}

main();