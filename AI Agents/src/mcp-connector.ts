import { SimpleMcpClient } from './simple-mcp-client.js';
import { MCPTool, MCPToolCall, MCPToolResult } from './types.js';

export class MCPConnector {
  private client: SimpleMcpClient;
  private isConnected: boolean = false;

  constructor(private serverPath: string) {
    this.client = new SimpleMcpClient(serverPath);
  }

  /**
   * Connect to the MCP server
   */
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.isConnected = true;
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      await this.disconnect();
      throw error;
    }
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      this.isConnected = false;
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }

  /**
   * Get list of available tools
   */
  getAvailableTools(): MCPTool[] {
    return this.client.getAvailableTools();
  }

  /**
   * Check if a tool is available
   */
  hasTool(toolName: string): boolean {
    return this.client.hasTool(toolName);
  }

  /**
   * Call a tool on the MCP server
   */
  async callTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    return this.client.callTool(toolCall);
  }

  /**
   * Call multiple tools in sequence
   */
  async callTools(toolCalls: MCPToolCall[]): Promise<MCPToolResult[]> {
    return this.client.callTools(toolCalls);
  }

  /**
   * Health check - verify connection is working
   */
  async healthCheck(): Promise<boolean> {
    return this.client.healthCheck();
  }

  /**
   * Reconnect to the server
   */
  async reconnect(): Promise<void> {
    console.log('Attempting to reconnect to MCP server...');
    await this.disconnect();
    await this.connect();
  }

  /**
   * Get connection status
   */
  isConnectedToServer(): boolean {
    return this.client.isConnectedToServer();
  }
}