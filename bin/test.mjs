#!/usr/bin/env node
/**
 * DailyHot MCP Test Client
 * 支持 stdio 和 HTTP 两种模式测试 MCP Server
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

// JSON-RPC request helper
let requestId = 1;
function createRequest(method, params = {}) {
  return JSON.stringify({
    jsonrpc: "2.0",
    id: requestId++,
    method,
    params,
  });
}

// Stdio transport
class StdioTransport {
  constructor(command, serverArgs) {
    this.command = command;
    this.serverArgs = serverArgs;
    this.process = null;
    this.buffer = "";
    this.resolvers = {};
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.process = spawn(this.command, this.serverArgs, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      this.process.stdout.on("data", (data) => {
        this.buffer += data.toString();
        this.processBuffer();
      });

      this.process.stderr.on("data", (data) => {
        console.error("Server:", data.toString().trim());
      });

      this.process.on("error", reject);
      this.process.on("close", (code) => {
        if (code !== 0) {
          console.error(`Server exited with code ${code}`);
        }
      });

      // Wait a bit for server to initialize
      setTimeout(resolve, 2000);
    });
  }

  processBuffer() {
    // Process complete JSON-RPC messages
    const lines = this.buffer.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line) {
        try {
          const response = JSON.parse(line);
          if (response.id && this.resolvers[response.id]) {
            const resolver = this.resolvers[response.id];
            delete this.resolvers[response.id];
            if (response.error) {
              resolver.reject(new Error(response.error.message));
            } else {
              resolver.resolve(response.result);
            }
          }
        } catch {
          // Not valid JSON, skip
        }
      }
    }
    // Keep incomplete line in buffer
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
      this.resolvers[id] = { resolve, reject };
      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.resolvers[id]) {
          delete this.resolvers[id];
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

// HTTP transport
class HttpTransport {
  constructor(url) {
    this.url = new URL(url);
  }

  async connect() {
    // Just test connection
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: this.url.hostname,
          port: this.url.port || 80,
          path: this.url.pathname + "?jsonrpc=2.0",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}`));
          } else {
            resolve();
          }
        }
      );
      req.on("error", reject);
      // MCP requires initialize first
      req.write(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "dailyhot-test-client", version: "1.0.0" },
          },
        })
      );
      req.end();
    });
  }

  async send(method, params = {}) {
    const requestData = JSON.stringify({
      jsonrpc: "2.0",
      id: requestId++,
      method,
      params,
    });

    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: this.url.hostname,
          port: this.url.port || 80,
          path: this.url.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const response = JSON.parse(data);
              if (response.error) {
                reject(new Error(response.error.message));
              } else {
                resolve(response.result);
              }
            } catch (e) {
              reject(e);
            }
          });
        }
      );
      req.on("error", reject);
      req.write(requestData);
      req.end();
    });
  }

  close() {
    // Nothing to close for HTTP
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

  // 解析 JSON 并格式化输出
  if (result.content && result.content[0]?.type === "text") {
    const data = JSON.parse(result.content[0].text);
    console.log("Response:");
    console.log(JSON.stringify(data, null, 2));
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
  --mode <stdio>         Connection mode (currently only stdio supported)
  --command <cmd>        Command to start MCP server (default: node)
  -- <args...>           Arguments passed to server process

Actions:
  list_tools             List all available tools
  list_platforms         List all platforms
  call <name>            Call a specific tool
  help                   Show this help

Examples:
  # List tools (uses local dist/index.js)
  node bin/test.mjs list_tools

  # Call weibo tool
  node bin/test.mjs call weibo --limit 5

  # Use npx to run remote version
  node bin/test.mjs --command npx -- -- -y @frank-x/dailyhot-mcp@latest list_tools

  # HTTP mode is not yet supported - use MCP SDK client directly
`);
    return;
  }

  // Only stdio mode is supported for now
  if (options.mode === "http") {
    console.log("HTTP mode requires using MCP SDK client directly.");
    console.log("Example:");
    console.log(`
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const client = new Client({ name: "test", version: "1.0.0" }, { capabilities: {} });
await client.connect(new StreamableHTTPClientTransport(new URL("http://localhost:3000/mcp")));
const result = await client.callTool({ name: "weibo", arguments: { limit: 5 } });
console.log(result);
`);
    process.exit(1);
  }

  let transport;

  try {
    transport = new StdioTransport(options.command, options.serverArgs);
    console.log(`Starting MCP server: ${options.command} ${options.serverArgs.join(" ")}`);
    await transport.connect();
    console.log("Connected to MCP server\n");

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