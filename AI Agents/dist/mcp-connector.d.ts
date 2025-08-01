import { MCPTool, MCPToolCall, MCPToolResult } from './types.js';
export declare class MCPConnector {
    private serverPath;
    private client;
    private isConnected;
    constructor(serverPath: string);
    /**
     * Connect to the MCP server
     */
    connect(): Promise<void>;
    /**
     * Disconnect from the MCP server
     */
    disconnect(): Promise<void>;
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
     * Reconnect to the server
     */
    reconnect(): Promise<void>;
    /**
     * Get connection status
     */
    isConnectedToServer(): boolean;
}
//# sourceMappingURL=mcp-connector.d.ts.map