# MCP Server Jake - DummyJSON Users API

A Model Context Protocol (MCP) server that provides access to the DummyJSON Users API. This server exposes user data through standardized MCP tools that can be consumed by MCP clients.

## Features

- **Get Users**: Fetch a paginated list of users with optional field selection
- **Get User by ID**: Retrieve a specific user by their unique ID
- **Search Users**: Search users using a query string
- **Filter Users**: Filter users by specific key-value pairs
- **Type-safe**: Built with TypeScript and Zod validation
- **Error handling**: Comprehensive error handling and logging
- **MCP compliant**: Fully compatible with MCP protocol standards

## Project Structure

```
src/
├── index.ts        # Main MCP server implementation
├── api-client.ts   # DummyJSON API client
└── types.ts        # TypeScript types and Zod schemas
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Available Tools

### 1. `get_users`
Fetch a list of users with pagination and field selection.

**Parameters**:
- `limit` (optional): Number of users to fetch (1-100, default: 30)
- `skip` (optional): Number of users to skip for pagination (default: 0)
- `select` (optional): Comma-separated list of fields to select

**Example**:
```json
{
  "limit": 10,
  "skip": 0,
  "select": "firstName,lastName,email"
}
```

### 2. `get_user_by_id`
Retrieve a specific user by their ID.

**Parameters**:
- `id` (required): User ID (1-208)
- `select` (optional): Comma-separated list of fields to select

**Example**:
```json
{
  "id": 1,
  "select": "firstName,lastName,email,age"
}
```

### 3. `search_users`
Search users using a query string.

**Parameters**:
- `q` (required): Search query
- `limit` (optional): Number of results to return (1-100, default: 30)
- `skip` (optional): Number of results to skip (default: 0)

**Example**:
```json
{
  "q": "John",
  "limit": 5
}
```

### 4. `filter_users`
Filter users by a specific key-value pair.

**Parameters**:
- `filterKey` (required): The key to filter by (e.g., "gender", "bloodGroup")
- `filterValue` (required): The value to filter by

**Example**:
```json
{
  "filterKey": "gender",
  "filterValue": "female"
}
```

## API Integration

The server integrates with the DummyJSON Users API:
- **Base URL**: `https://dummyjson.com`
- **Endpoints Used**:
  - `GET /users` - Get all users
  - `GET /users/{id}` - Get user by ID  
  - `GET /users/search` - Search users
  - `GET /users/filter` - Filter users

## MCP Client Integration

This server is designed to be consumed by MCP clients. When you create your MCP client in the next step, it should:

1. Connect to this server via stdio transport
2. List available tools using the MCP protocol
3. Call tools with proper argument validation
4. Handle responses and errors appropriately

## Development

- **Watch mode**: `npm run watch` - Automatically rebuilds on file changes
- **Type checking**: Built with strict TypeScript settings
- **Validation**: All inputs/outputs validated with Zod schemas
- **Logging**: Comprehensive logging for debugging

## Error Handling

The server includes robust error handling:
- Input validation using Zod schemas
- HTTP request/response error handling
- Proper MCP error responses
- Detailed logging for troubleshooting

## Next Steps

1. Test the server with an MCP client
2. Extend with additional DummyJSON endpoints if needed
3. Add authentication if required
4. Implement caching for better performance

## Dependencies

- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `axios`: HTTP client for API requests
- `zod`: Runtime type validation
- `typescript`: Type safety and compilation