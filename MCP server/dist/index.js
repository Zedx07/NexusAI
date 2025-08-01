#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const api_clients_1 = require("./api-clients");
const types_js_2 = require("./types.js");
class MCPServer {
    server;
    apiClient;
    constructor() {
        this.server = new index_js_1.Server({
            name: 'mcp-server-jake',
            version: '1.0.0',
        });
        this.apiClient = new api_clients_1.DummyJSONClient();
        this.setupHandlers();
    }
    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            const tools = [
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
                // {
                //   name: 'search_users',
                //   description: 'Search users by query string',
                //   inputSchema: {
                //     type: 'object',
                //     properties: {
                //       q: {
                //         type: 'string',
                //         minLength: 1,
                //         description: 'Search query to filter users',
                //       },
                //       limit: {
                //         type: 'number',
                //         minimum: 1,
                //         maximum: 100,
                //         default: 30,
                //         description: 'Number of users to fetch',
                //       },
                //       skip: {
                //         type: 'number',
                //         minimum: 0,
                //         default: 0,
                //         description: 'Number of users to skip',
                //       },
                //     },
                //     required: ['q'],
                //   },
                // },
                // {
                //   name: 'filter_users',
                //   description: 'Filter users by a specific key-value pair',
                //   inputSchema: {
                //     type: 'object',
                //     properties: {
                //       filterKey: {
                //         type: 'string',
                //         description: 'The key to filter by (e.g., "gender", "bloodGroup")',
                //       },
                //       filterValue: {
                //         type: 'string',
                //         description: 'The value to filter by',
                //       },
                //     },
                //     required: ['filterKey', 'filterValue'],
                //   },
                // },
            ];
            return { tools };
        });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
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
            }
            catch (error) {
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
    async handleGetUsers(args) {
        const validatedArgs = types_js_2.GetUsersArgsSchema.parse(args || {});
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
    async handleGetUserById(args) {
        const validatedArgs = types_js_2.GetUserByIdArgsSchema.parse(args);
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
    async handleSearchUsers(args) {
        const validatedArgs = types_js_2.SearchUsersArgsSchema.parse(args);
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
    async handleFilterUsers(args) {
        const { filterKey, filterValue } = args;
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
    async start() {
        const transport = new stdio_js_1.StdioServerTransport();
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
//# sourceMappingURL=index.js.map