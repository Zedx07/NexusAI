"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleMcpClient = void 0;
const child_process_1 = require("child_process");
class SimpleMcpClient {
    serverPath;
    serverProcess = null;
    isConnected = false;
    availableTools = [];
    requestId = 1;
    pendingRequests = new Map();
    messageBuffer = '';
    constructor(serverPath) {
        this.serverPath = serverPath;
    }
    /**
     * Connect to the MCP server
     */
    async connect() {
        try {
            console.log('Starting MCP server process...');
            this.serverProcess = (0, child_process_1.spawn)('node', [this.serverPath], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: { ...process.env },
            });
            if (!this.serverProcess || !this.serverProcess.stdout || !this.serverProcess.stdin) {
                throw new Error('Failed to start server process');
            }
            // Handle server output
            this.serverProcess.stdout.on('data', (data) => {
                this.handleServerMessage(data.toString());
            });
            // Handle server errors
            this.serverProcess.stderr.on('data', (data) => {
                console.log('MCP Server:', data.toString().trim());
            });
            this.serverProcess.on('exit', (code) => {
                console.log(`MCP server exited with code ${code}`);
                this.isConnected = false;
            });
            // Wait a moment for the server to start
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Initialize the connection
            await this.initialize();
            this.isConnected = true;
            console.log('Successfully connected to MCP server');
            // Load available tools
            await this.loadTools();
        }
        catch (error) {
            console.error('Failed to connect to MCP server:', error);
            await this.disconnect();
            throw error;
        }
    }
    /**
     * Initialize the MCP connection
     */
    async initialize() {
        const initRequest = {
            jsonrpc: '2.0',
            id: this.requestId++,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {
                    tools: {}
                },
                clientInfo: {
                    name: 'ai-agent-client',
                    version: '1.0.0'
                }
            }
        };
        await this.sendRequest(initRequest);
        // Send initialized notification
        const initializedNotification = {
            jsonrpc: '2.0',
            method: 'notifications/initialized',
            params: {}
        };
        this.sendNotification(initializedNotification);
    }
    /**
     * Handle messages from the server
     */
    handleServerMessage(data) {
        // Add incoming data to buffer
        this.messageBuffer += data;
        // Process complete messages (separated by newlines)
        const lines = this.messageBuffer.split('\n');
        // Keep the last incomplete line in the buffer
        this.messageBuffer = lines.pop() || '';
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine)
                continue;
            try {
                const message = JSON.parse(trimmedLine);
                if (message.id !== undefined && this.pendingRequests.has(message.id)) {
                    const { resolve, reject } = this.pendingRequests.get(message.id);
                    this.pendingRequests.delete(message.id);
                    if (message.error) {
                        reject(new Error(message.error.message || 'Server error'));
                    }
                    else {
                        resolve(message.result);
                    }
                }
            }
            catch (error) {
                console.error('Failed to parse server message:', trimmedLine, error);
            }
        }
    }
    /**
     * Send a request to the server
     */
    async sendRequest(request) {
        return new Promise((resolve, reject) => {
            if (!this.serverProcess || !this.serverProcess.stdin) {
                reject(new Error('Not connected to server'));
                return;
            }
            this.pendingRequests.set(request.id, { resolve, reject });
            const requestString = JSON.stringify(request) + '\n';
            this.serverProcess.stdin.write(requestString);
            // Set a timeout for the request
            setTimeout(() => {
                if (this.pendingRequests.has(request.id)) {
                    this.pendingRequests.delete(request.id);
                    reject(new Error('Request timeout'));
                }
            }, 10000); // 10 second timeout
        });
    }
    /**
     * Send a notification to the server
     */
    sendNotification(notification) {
        if (!this.serverProcess || !this.serverProcess.stdin) {
            return;
        }
        const notificationString = JSON.stringify(notification) + '\n';
        this.serverProcess.stdin.write(notificationString);
    }
    /**
     * Load available tools from the server
     */
    async loadTools() {
        try {
            const request = {
                jsonrpc: '2.0',
                id: this.requestId++,
                method: 'tools/list',
                params: {}
            };
            const result = await this.sendRequest(request);
            this.availableTools = result.tools.map((tool) => ({
                name: tool.name,
                description: tool.description || '',
                inputSchema: tool.inputSchema || { type: 'object', properties: {} },
            }));
            console.log(`Loaded ${this.availableTools.length} tools:`, this.availableTools.map(t => t.name).join(', '));
        }
        catch (error) {
            console.error('Failed to load tools:', error);
            throw error;
        }
    }
    /**
     * Get list of available tools
     */
    getAvailableTools() {
        return [...this.availableTools];
    }
    /**
     * Check if a tool is available
     */
    hasTool(toolName) {
        return this.availableTools.some(tool => tool.name === toolName);
    }
    /**
     * Call a tool on the MCP server
     */
    async callTool(toolCall) {
        if (!this.hasTool(toolCall.name)) {
            throw new Error(`Tool '${toolCall.name}' is not available`);
        }
        try {
            console.log(`Calling tool: ${toolCall.name}`, toolCall.arguments);
            const request = {
                jsonrpc: '2.0',
                id: this.requestId++,
                method: 'tools/call',
                params: {
                    name: toolCall.name,
                    arguments: toolCall.arguments,
                },
            };
            const result = await this.sendRequest(request);
            console.log(`Tool call result for ${toolCall.name}:`, result);
            return {
                content: result.content.filter((item) => item.type === 'text').map((item) => ({
                    type: 'text',
                    text: item.text,
                })),
                isError: result.isError || false,
            };
        }
        catch (error) {
            console.error(`Failed to call tool ${toolCall.name}:`, error);
            throw error;
        }
    }
    /**
     * Call multiple tools in sequence
     */
    async callTools(toolCalls) {
        const results = [];
        for (const toolCall of toolCalls) {
            try {
                const result = await this.callTool(toolCall);
                results.push(result);
            }
            catch (error) {
                // Add error result and continue
                results.push({
                    content: [
                        {
                            type: 'text',
                            text: `Error calling tool ${toolCall.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        },
                    ],
                    isError: true,
                });
            }
        }
        return results;
    }
    /**
     * Health check - verify connection is working
     */
    async healthCheck() {
        try {
            if (!this.isConnected || !this.serverProcess) {
                return false;
            }
            // Try to list tools as a health check
            await this.loadTools();
            return true;
        }
        catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
    /**
     * Disconnect from the MCP server
     */
    async disconnect() {
        try {
            if (this.serverProcess) {
                this.serverProcess.kill();
                this.serverProcess = null;
            }
            this.isConnected = false;
            this.availableTools = [];
            this.pendingRequests.clear();
            this.messageBuffer = '';
            console.log('Disconnected from MCP server');
        }
        catch (error) {
            console.error('Error during disconnect:', error);
        }
    }
    /**
     * Get connection status
     */
    isConnectedToServer() {
        return this.isConnected;
    }
}
exports.SimpleMcpClient = SimpleMcpClient;
//# sourceMappingURL=simple-mcp-client.js.map