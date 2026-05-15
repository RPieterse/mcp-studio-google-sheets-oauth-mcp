#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { createSheetsApi } from "./sheets.js";
import { parseOAuthEnv } from "./credentials.js";

let api;
try {
  const creds = parseOAuthEnv();
  api = createSheetsApi(creds);
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error(`[google-sheets-oauth-mcp] auth error: ${msg}`);
  process.exit(1);
}

const server = createServer({ api });
const transport = new StdioServerTransport();
await server.connect(transport);
