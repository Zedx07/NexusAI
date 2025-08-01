# NexusAI Chat Interface

A modern, responsive web-based chat interface for interacting with the NexusAI API. This chat application provides a seamless way to communicate with the AI agent powered by Gemini and equipped with MCP tools.

## Features

### 🎨 Modern UI/UX

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Status**: Connection status indicator with health monitoring
- **Typing Indicators**: Visual feedback when the AI is processing
- **Message Animations**: Smooth animations for better user experience
- **Dark/Light Theme**: Professional gradient design

### 💬 Chat Features

- **Real-time Messaging**: Instant communication with the AI agent
- **Conversation History**: Maintains context throughout the conversation
- **Message Formatting**: Support for links, line breaks, and rich text
- **Character Counter**: Shows remaining character count (2000 limit)
- **Auto-scroll**: Automatically scrolls to new messages
- **Sound Notifications**: Optional audio alerts for new messages

### ⚙️ Configuration

- **API Settings**: Configurable API base URL
- **User Management**: Optional user ID for personalized conversations
- **Connection Testing**: Built-in connection testing functionality
- **Persistent Settings**: Settings saved in browser localStorage

### 🔧 Advanced Features

- **Tool Information**: View available MCP tools
- **Conversation Management**: Clear conversations with confirmation
- **Error Handling**: Graceful error handling with user-friendly messages
- **Health Monitoring**: Continuous connection health checks
- **Toast Notifications**: Non-intrusive status notifications

## Getting Started

### 1. Prerequisites

- A running NexusAI API server (default: `http://localhost:3002`)
- Modern web browser with JavaScript enabled

### 2. Setup

1. **Start the AI Agents Service**:

   ```bash
   cd ../AI\ Agents
   npm run dev
   ```

2. **Open the Chat Interface**:

   - Open `index.html` in your web browser
   - Or serve it using a local web server:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (if you have serve installed)
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Access the Chat**:
   - Navigate to `http://localhost:8000` (if using a server)
   - Or directly open `file:///path/to/index.html`

### 3. Configuration

Click the **Settings** button (⚙️) to configure:

- **API Base URL**: URL of your AI Agents service (default: `http://localhost:3002`)
- **User ID**: Optional unique identifier for your conversations
- **Auto-scroll**: Enable/disable automatic scrolling to new messages
- **Sound Notifications**: Enable/disable audio notifications

### 4. Testing Connection

Use the included `test-connection.html` file to verify your API connection:

```bash
# Open the test file in your browser
open test-connection.html
```

This will test all endpoints and show detailed connection information.

- **Auto-scroll**: Enable/disable automatic scrolling to new messages
- **Sound Notifications**: Enable/disable audio notifications

## Usage Examples

### Basic Chat

```
You: "Find users named John"
AI: "I found 2 users named John in the system:
1. John Doe (ID: 1) - john.doe@example.com
2. John Smith (ID: 15) - johnsmith@example.com"
```

### Tool Usage

```
You: "Get user information for ID 5"
AI: "I'll look up the user information for ID 5.
[Calls get_user_by_id tool]
Here's the information for user ID 5:
- Name: Jane Wilson
- Email: jane.wilson@example.com
- Phone: (555) 123-4567"
```

### Data Filtering

```
You: "Show me users from New York"
AI: "I'll search for users from New York.
[Calls filter_users tool]
Found 8 users from New York:
- Alice Johnson (alice.johnson@example.com)
- Bob Martinez (bob.martinez@example.com)
[... more results]"
```

## File Structure

```
Chat/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and responsive design
├── script.js               # JavaScript application logic
├── test-connection.html    # API connection testing tool
└── README.md               # This documentation
```

## API Integration

The chat interface integrates with the following API endpoints:

### Health Check

- **Endpoint**: `GET /health`
- **Purpose**: Monitor connection status and available tools

### Chat

- **Endpoint**: `POST /chat`
- **Purpose**: Send messages and receive AI responses
- **Payload**:
  ```json
  {
    "message": "User message",
    "conversationId": "optional-conversation-id",
    "userId": "optional-user-id"
  }
  ```

### Conversations

- **Clear**: `DELETE /conversations/:conversationId`
- **Purpose**: Clear conversation history

### Tools

- **Endpoint**: `GET /tools`
- **Purpose**: Get list of available MCP tools

## Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile Browsers**: ✅ Responsive design

## Troubleshooting

### Connection Issues

1. **"Offline" Status**:

   - Ensure the AI Agents service is running
   - Check the API URL in settings
   - Use "Test Connection" in settings

2. **CORS Errors**:

   - Make sure CORS is properly configured in the AI Agents service
   - Check that the frontend origin is allowed

3. **Network Errors**:
   - Verify firewall settings
   - Check if the port is accessible
   - Try different network connection

### Common Problems

**Messages not sending**:

- Check connection status indicator
- Ensure message is not empty
- Verify API service is responding
- Use `test-connection.html` to debug API issues

**"Offline" Status**:

- Ensure AI Agents service is running on port 3002
- Check API URL in settings matches your server
- Verify CORS is configured properly in the AI Agents service
- Try the "Test Connection" button in settings

**API Response Issues**:

- The frontend now handles both old and new API response formats
- Check browser console for detailed error messages
- Verify the AI Agents service is returning proper JSON responses

**No typing indicator**:

- Normal behavior for quick responses
- Indicates good API performance

**Settings not saving**:

- Check browser localStorage permissions
- Try clearing browser cache

## Customization

### Styling

Modify `styles.css` to customize:

- Color scheme and theme
- Layout and spacing
- Animations and transitions
- Mobile responsiveness

### Functionality

Extend `script.js` to add:

- Additional API endpoints
- Custom message formatting
- Enhanced error handling
- New UI components

### HTML Structure

Update `index.html` to:

- Add new UI elements
- Modify layout structure
- Include additional libraries
- Change metadata and titles

## Security Notes

- API keys are handled server-side only
- No sensitive data stored in localStorage
- CORS protection on API endpoints
- Input validation and sanitization
- XSS protection through proper escaping

## Performance

- **Lightweight**: Minimal dependencies, fast loading
- **Efficient**: Optimized DOM manipulation
- **Responsive**: Smooth animations and interactions
- **Scalable**: Handles long conversations gracefully

## Future Enhancements

Potential improvements:

- **File Upload**: Support for image/document uploads
- **Voice Input**: Speech-to-text integration
- **Export**: Save conversations to file
- **Themes**: Multiple color themes
- **Plugins**: Extensible plugin system
- **PWA**: Progressive Web App capabilities

## Support

For issues and questions:

1. Check the AI Agents service logs
2. Verify API endpoint availability
3. Test with different browsers
4. Check browser console for errors

## Contributing

To contribute to the chat interface:

1. Follow the existing code style
2. Test on multiple browsers
3. Ensure responsive design
4. Add appropriate comments
5. Update documentation as needed
