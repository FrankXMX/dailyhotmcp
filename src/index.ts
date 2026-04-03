import { main } from "./mcp/index.js";

export { main };

// For backward compatibility: check if this is run directly via node dist/index.js
// (but NOT when imported from bin/cli.mjs)
const isDirectRun =
  process.argv[1]?.endsWith("/dist/index.js") ||
  process.argv[1]?.endsWith("\\dist\\index.js");

if (isDirectRun) {
  await main();
}
