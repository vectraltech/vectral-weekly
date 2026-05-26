import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Default to Jina Reader. Override with READER_BASE_URL only for tests.
const BASE = process.env.READER_BASE_URL ?? "https://r.jina.ai";

const server = new Server(
  { name: "url-reader", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "fetch_url",
      description:
        "Fetch a web page and return its main content as clean markdown. Useful for letting an LLM read articles, docs, or any public URL.",
      inputSchema: {
        type: "object",
        properties: { url: { type: "string", description: "The URL to fetch." } },
        required: ["url"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "fetch_url") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }
  const url = request.params.arguments?.url as string;
  const response = await fetch(`${BASE}/${url}`);
  const markdown = await response.text();
  return { content: [{ type: "text", text: markdown }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
