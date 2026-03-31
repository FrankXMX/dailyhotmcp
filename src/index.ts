import { main } from "./mcp/index.js";

export { main };

// Only run main when executed directly (not when imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
