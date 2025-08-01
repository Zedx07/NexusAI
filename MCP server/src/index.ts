#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolResult,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { DummyJSONClient } from './api-clients';
import {
  GetUsersArgsSchema,
  GetUserByIdArgsSchema,
  SearchUsersArgsSchema,
  GetUsersArgs,
  GetUserByIdArgs,
  SearchUsersArgs,
} from './types.js';

class MCPServer {
  private server: Server;
  private apiClient: DummyJSONClient;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-server-jake',
        version: '1.0.0',
      }
    );

    this.apiClient = new DummyJSONClient();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: 'get_users',
          description: 'Fetch a list of users with optional pagination and field selection',
          inputSchema: {
            type: 'object',
            properties: {
              limit: {
                type: 'number',
                minimum: 1,
                maximum: 100,
                default: 30,
                description: 'Number of users to fetch (1-100)',
              },
              skip: {
                type: 'number',
                minimum: 0,
                default: 0,
                description: 'Number of users to skip for pagination',
              },
              select: {
                type: 'string',
                description: 'Comma-separated list of fields to select (e.g., "firstName,lastName,email")',
              },
            },
          },
        },
        {
          name: 'get_user_by_id',
          description: 'Fetch a single user by their ID',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                minimum: 1,
                maximum: 208,
                description: 'User ID (1-208)',
              },
              select: {
                type: 'string',
                description: 'Comma-separated list of fields to select',
              },
            },
            required: ['id'],
          },
        },
        {
          name: 'search_users',
          description: 'Search users by query string',
          inputSchema: {
            type: 'object',
            properties: {
              q: {
                type: 'string',
                minLength: 1,
                description: 'Search query to filter users',
              },
              limit: {
                type: 'number',
                minimum: 1,
                maximum: 100,
                default: 30,
                description: 'Number of users to fetch',
              },
              skip: {
                type: 'number',
                minimum: 0,
                default: 0,
                description: 'Number of users to skip',
              },
            },
            required: ['q'],
          },
        },
        {
          name: 'filter_users',
          description: 'Filter users by a specific key-value pair',
          inputSchema: {
            type: 'object',
            properties: {
              filterKey: {
                type: 'string',
                description: 'The key to filter by (e.g., "gender", "bloodGroup")',
              },
              filterValue: {
                type: 'string',
                description: 'The value to filter by',
              },
            },
            required: ['filterKey', 'filterValue'],
          },
        },
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_users':
            return await this.handleGetUsers(args);
          case 'get_user_by_id':
            return await this.handleGetUserById(args);
          case 'search_users':
            return await this.handleSearchUsers(args);
          case 'filter_users':
            return await this.handleFilterUsers(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async handleGetUsers(args: unknown): Promise<CallToolResult> {
    const validatedArgs = GetUsersArgsSchema.parse(args || {});
    const result = await this.apiClient.getUsers(validatedArgs);

    return {
      content: [
        {
          type: 'text',
          text: `Found ${result.total} users (showing ${result.users.length}):

${JSON.stringify(result, null, 2)}`,
        },
      ],
      isError: false,
    };
  }

  private async handleGetUserById(args: unknown): Promise<CallToolResult> {
    const validatedArgs = GetUserByIdArgsSchema.parse(args);
    const user = await this.apiClient.getUserById(validatedArgs.id, validatedArgs.select);

    return {
      content: [
        {
          type: 'text',
          text: `User ${validatedArgs.id}:

${JSON.stringify(user, null, 2)}`,
        },
      ],
      isError: false,
    };
  }

  private async handleSearchUsers(args: unknown): Promise<CallToolResult> {
    const validatedArgs = SearchUsersArgsSchema.parse(args);
    const result = await this.apiClient.searchUsers(validatedArgs);

    return {
      content: [
        {
          type: 'text',
          text: `Search results for "${validatedArgs.q}" (${result.total} matches, showing ${result.users.length}):

${JSON.stringify(result, null, 2)}`,
        },
      ],
      isError: false,
    };
  }

  private async handleFilterUsers(args: unknown): Promise<CallToolResult> {
    const { filterKey, filterValue } = args as { filterKey: string; filterValue: string };
    
    if (!filterKey || !filterValue) {
      throw new Error('filterKey and filterValue are required');
    }

    const result = await this.apiClient.filterUsers(filterKey, filterValue);

    return {
      content: [
        {
          type: 'text',
          text: `Filter results for ${filterKey}="${filterValue}" (${result.total} matches, showing ${result.users.length}):

${JSON.stringify(result, null, 2)}`,
        },
      ],
      isError: false,
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Server Jake started successfully'); // Use stderr for logging
  }
}

// Start the server
const server = new MCPServer();
server.start().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});