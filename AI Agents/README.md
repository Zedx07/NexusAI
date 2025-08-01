# AI Agents - MCP Client with Gemini Integration

This service acts as an AI agent that combines Google's Gemini LLM with Model Context Protocol (MCP) tools. It connects to your MCP server to access external resources and provides a REST API for chat applications.

## Architecture

```
Chat App Frontend → AI Agents (MCP Client + Gemini) → MCP Server → External APIs
```

## Features

- **🤖 Gemini LLM Integration**: Uses Google's Gemini 1.5 Pro for natural language processing
- **🔗 MCP Client**: Connects to MCP servers for tool execution
- **💬 Conversation Management**: Maintains conversation history and context
- **🛠️ Tool Calling**: Automatically calls appropriate tools based on user queries
- **🔄 Health Monitoring**: Built-in health checks and reconnection logic
- **🚀 REST API**: Clean HTTP API for frontend integration
- **🔒 Security**: CORS, Helmet, and input validation

## Project Structure

```
src/
├── index.ts           # Main entry point
├── api-server.ts      # Express API server
├── ai-agent.ts        # Core AI agent logic
├── mcp-connector.ts   # MCP server connection
├── gemini-client.ts   # Gemini LLM client
└── types.ts           # TypeScript types
```

## Setup

1. **Environment Variables**:
   Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

   Fill in your configuration:

   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-pro
   MCP_SERVER_PATH=../MCP server/dist/index.js
   PORT=3002
   CORS_ORIGIN=http://localhost:3000,http://localhost:8000,http://localhost:8080
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Build the Project**:

   ```bash
   npm run build
   ```

4. **Start the Service**:

   ```bash
   npm start
   ```

   For development:

   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check

```bash
GET /health
```

Returns the health status of the service and MCP connection.

### Chat

```bash
POST /chat
Content-Type: application/json

{
  "message": "Find users named John",
  "conversationId": "optional-conversation-id",
  "userId": "optional-user-id"
}
```

### Conversations

```bash
# Get conversation
GET /conversations/:conversationId

# Get user conversations
GET /users/:userId/conversations

# Clear conversation
DELETE /conversations/:conversationId
```

### Tools

```bash
# Get available tools
GET /tools

# Reconnect MCP (admin)
POST /admin/reconnect-mcp
```

### Configuration

```bash
# Get current config (API key redacted)
GET /config
```

## How It Works

1. **User sends a message** via the `/chat` endpoint
2. **AI Agent processes** the message:
   - Analyzes the user's intent using Gemini
   - Determines if tools are needed
   - Calls appropriate MCP tools if required
3. **Tool execution** via MCP connector:
   - Connects to MCP server via stdio
   - Executes tools (e.g., fetch users, search data)
   - Returns structured results
4. **Response generation**:
   - Gemini processes tool results
   - Generates natural language response
   - Maintains conversation context

## Example Flow

```
User: "Find users named John"
  ↓
Gemini: Analyzes intent → Tool call: search_users(q: "John")
  ↓
MCP Server: Searches DummyJSON API → Returns user data
  ↓
Gemini: Processes results → "I found 2 users named John..."
  ↓
API Response: Natural language + structured data
```

## MCP Integration

The service connects to your MCP server automatically:

- **Connection**: Spawns MCP server process via Node.js child_process
- **Communication**: Uses stdio transport for MCP protocol
- **Tools**: Dynamically loads available tools from server
- **Error Handling**: Reconnects on connection loss
- **Health Checks**: Monitors connection status

Available tools from your MCP server:

- `get_users` - Fetch paginated user list
- `get_user_by_id` - Get specific user
- `search_users` - Search users by query
- `filter_users` - Filter by key-value

## Gemini Configuration

The service uses Gemini 1.5 Pro with:

- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max Tokens**: 8192
- **Function Calling**: Enabled for tool integration
- **System Prompts**: Customizable agent personality

## Error Handling

Comprehensive error handling for:

- **MCP Connection Failures**: Auto-reconnection logic
- **Gemini API Errors**: Fallback responses
- **Tool Execution Errors**: Graceful degradation
- **Validation Errors**: Zod schema validation
- **Network Issues**: Retry mechanisms

## Development

- **TypeScript**: Full type safety
- **Hot Reload**: `npm run watch` for development
- **Logging**: Comprehensive request/error logging
- **Testing**: Jest setup (add tests as needed)

## Monitoring

Check service health:

```bash
curl http://localhost:3002/health
```

Response includes:

- Service status
- MCP connection status
- Available tools
- Active conversation count

## Next Steps

1. **Test with Frontend**: Connect to your chat app
2. **Add More Tools**: Extend MCP server with additional APIs
3. **Enhance Prompts**: Customize system prompts for your use case
4. **Add Authentication**: Implement user auth if needed
5. **Deploy**: Configure for production deployment

## Troubleshooting

**MCP Connection Issues**:

- Check MCP server path in `.env`
- Ensure MCP server builds successfully
- Check logs for connection errors

**Gemini API Issues**:

- Verify API key is correct
- Check quota/billing in Google AI Studio
- Review API rate limits

**Port Conflicts**:

- Change PORT in `.env` if 3002 is taken
- Update CORS_ORIGIN for your frontend
