import { MCPTool, MCPToolCall, MCPToolResult } from './types.js';
export declare class SimpleMcpClient {
    private serverPath;
    private serverProcess;
    private isConnected;
    private availableTools;
    private requestId;
    private pendingRequests;
    private messageBuffer;
    constructor(serverPath: string);
    /**
     * Connect to the MCP server
     */
    connect(): Promise<void>;
    /**
     * Initialize the MCP connection
     */
    private initialize;
    /**
     * Handle messages from the server
     */
    private handleServerMessage;
    /**
     * Send a request to the server
     */
    private sendRequest;
    /**
     * Send a notification to the server
     */
    private sendNotification;
    /**
     * Load available tools from the server
     */
    private loadTools;
    /**
     * Get list of available tools
     */
    getAvailableTools(): MCPTool[];
    /**
     * Check if a tool is available
     */
    hasTool(toolName: string): boolean;
    /**
     * Call a tool on the MCP server
     */
    callTool(toolCall: MCPToolCall): Promise<MCPToolResult>;
    /**
     * Call multiple tools in sequence
     */
    callTools(toolCalls: MCPToolCall[]): Promise<MCPToolResult[]>;
    /**
     * Health check - verify connection is working
     */
    healthCheck(): Promise<boolean>;
    /**
     * Disconnect from the MCP server
     */
    disconnect(): Promise<void>;
    /**
     * Get connection status
     */
    isConnectedToServer(): boolean;
}
//# sourceMappingURL=simple-mcp-client.d.ts.map