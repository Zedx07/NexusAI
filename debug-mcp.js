#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

console.log('ListToolsRequestSchema:', typeof ListToolsRequestSchema);
console.log('ListToolsRequestSchema methods:', Object.getOwnPropertyNames(ListToolsRequestSchema));

const server = new Server(
  {
    name: 'debug-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log('Tools list requested');
  const tools = [
    {
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Test message',
          },
        },
        required: ['message'],
      },
    },
  ];

  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.log('Tool call requested:', request.params);
  return {
    content: [
      {
        type: 'text',
        text: 'Test response',
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Debug MCP server started');
}

main().catch(console.error);
