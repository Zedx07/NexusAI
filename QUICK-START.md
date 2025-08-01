# 🚀 Quick Start Guide - NexusAI Port Synchronized

All components are now synchronized to use **port 3002**. Here's how to get everything running:

## 📋 Pre-Start Checklist

✅ **Backend (AI Agents)**: Port 3002  
✅ **Frontend (Chat)**: Configured for port 3002  
✅ **CORS**: Configured for multiple origins including file://  
✅ **Environment**: .env file set to port 3002

## 🏃‍♂️ Start Instructions

### 1. Start the AI Agents Backend

```bash
cd "AI Agents"
npm run dev
```

**Expected output:**

```
🚀 API Server running on port 3002
📊 Health check: http://localhost:3002/health
💬 Chat endpoint: http://localhost:3002/chat
```

### 2. Test the Connection

```bash
cd Chat
# Open test-connection.html in your browser
start test-connection.html
```

**Expected result:** All tests should pass with green checkmarks

### 3. Use the Chat Interface

```bash
cd Chat
# Open index.html in your browser
start index.html
```

**Expected result:** Status should show "Connected" in the header

## 🔧 Troubleshooting

### Backend Issues

- **Port already in use:** Check if another service is using port 3002
- **MCP connection failed:** Ensure MCP server is built (`npm run build` in MCP server folder)
- **Gemini API issues:** Verify your API key in `.env` file

### Frontend Issues

- **CORS errors:** Backend now supports file:// protocol and multiple origins
- **Connection refused:** Verify backend is running on port 3002
- **Old cached settings:** Clear browser localStorage or update in Settings modal

### Quick Verification Commands

```bash
# Check if backend is running
curl http://localhost:3002/health

# Check available tools
curl http://localhost:3002/tools

# Test chat endpoint
curl -X POST http://localhost:3002/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userId":"test"}'
```

## 📁 File Locations

**Backend Configuration:**

- `AI Agents/.env` - Environment variables (PORT=3002)
- `AI Agents/src/api-server.ts` - API server with CORS config

**Frontend Configuration:**

- `Chat/script.js` - Default API URL: http://localhost:3002
- `Chat/index.html` - Settings modal default: http://localhost:3002
- `Chat/test-connection.html` - Test tool configured for port 3002

## 🎯 What's Synchronized

| Component            | Configuration      | Status |
| -------------------- | ------------------ | ------ |
| Backend Default Port | 3002               | ✅     |
| Environment Variable | PORT=3002          | ✅     |
| Frontend Default URL | localhost:3002     | ✅     |
| HTML Settings Input  | localhost:3002     | ✅     |
| Test Tool            | localhost:3002     | ✅     |
| CORS Origins         | Multiple + file:// | ✅     |

Everything is now ready to use! 🎉
