"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPConnector = void 0;
const simple_mcp_client_js_1 = require("./simple-mcp-client.js");
class MCPConnector {
    serverPath;
    client;
    isConnected = false;
    constructor(serverPath) {
        this.serverPath = serverPath;
        this.client = new simple_mcp_client_js_1.SimpleMcpClient(serverPath);
    }
    /**
     * Connect to the MCP server
     */
    async connect() {
        try {
            await this.client.connect();
            this.isConnected = true;
        }
        catch (error) {
            console.error('Failed to connect to MCP server:', error);
            await this.disconnect();
            throw error;
        }
    }
    /**
     * Disconnect from the MCP server
     */
    async disconnect() {
        try {
            await this.client.disconnect();
            this.isConnected = false;
        }
        catch (error) {
            console.error('Error during disconnect:', error);
        }
    }
    /**
     * Get list of available tools
     */
    getAvailableTools() {
        return this.client.getAvailableTools();
    }
    /**
     * Check if a tool is available
     */
    hasTool(toolName) {
        return this.client.hasTool(toolName);
    }
    /**
     * Call a tool on the MCP server
     */
    async callTool(toolCall) {
        return this.client.callTool(toolCall);
    }
    /**
     * Call multiple tools in sequence
     */
    async callTools(toolCalls) {
        return this.client.callTools(toolCalls);
    }
    /**
     * Health check - verify connection is working
     */
    async healthCheck() {
        return this.client.healthCheck();
    }
    /**
     * Reconnect to the server
     */
    async reconnect() {
        console.log('Attempting to reconnect to MCP server...');
        await this.disconnect();
        await this.connect();
    }
    /**
     * Get connection status
     */
    isConnectedToServer() {
        return this.client.isConnectedToServer();
    }
}
exports.MCPConnector = MCPConnector;
//# sourceMappingURL=mcp-connector.js.map