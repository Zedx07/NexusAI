import { v4 as uuidv4 } from 'uuid';
import { MCPConnector } from './mcp-connector.js';
import { GeminiClient } from './gemini-client.js';
import {
  Message,
  ChatRequest,
  ChatResponse,
  Conversation,
  AgentConfig,
  MCPToolCall,
} from './types.js';

export class AIAgent {
  private mcpConnector: MCPConnector;
  private geminiClient: GeminiClient;
  private conversations: Map<string, Conversation> = new Map();
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.mcpConnector = new MCPConnector(config.mcpServerPath);
    this.geminiClient = new GeminiClient(config.geminiConfig);
  }

  /**
   * Initialize the AI agent
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing AI Agent...');
      
      // Connect to MCP server
      await this.mcpConnector.connect();
      
      console.log('AI Agent initialized successfully');
      console.log('Available tools:', this.mcpConnector.getAvailableTools().map(t => t.name));
    } catch (error) {
      console.error('Failed to initialize AI Agent:', error);
      throw error;
    }
  }

  /**
   * Process a chat request and generate a response
   */
  async processChat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const conversationId = request.conversationId || uuidv4();
      const messageId = uuidv4();
      
      // Get or create conversation
      let conversation = this.conversations.get(conversationId);
      if (!conversation) {
        conversation = {
          id: conversationId,
          userId: request.userId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.conversations.set(conversationId, conversation);
      }

      // Add user message to conversation
      const userMessage: Message = {
        id: messageId,
        role: 'user',
        content: request.message,
        timestamp: new Date(),
      };
      conversation.messages.push(userMessage);

      // Get available tools (filtered by enabled tools if specified)
      const availableTools = this.getEnabledTools();

      // Generate initial response with Gemini
      const geminiResult = await this.geminiClient.generateResponse(
        conversation.messages,
        availableTools,
        this.config.systemPrompt
      );

      let finalResponse = geminiResult.response;
      const toolCallResults: Array<{ toolName: string; arguments: any; result: any }> = [];

      // Execute tool calls if any
      if (geminiResult.toolCalls && geminiResult.toolCalls.length > 0) {
        console.log('Executing tool calls:', geminiResult.toolCalls);

        const toolResults = await this.mcpConnector.callTools(geminiResult.toolCalls);

        // Collect tool call results
        for (let i = 0; i < geminiResult.toolCalls.length; i++) {
          const toolCall = geminiResult.toolCalls[i];
          const result = toolResults[i];

          toolCallResults.push({
            toolName: toolCall.name,
            arguments: toolCall.arguments,
            result: result,
          });
        }

        // Generate follow-up response with tool results
        const followUpResult = await this.geminiClient.generateFollowUpResponse(
          conversation.messages,
          toolCallResults,
          this.config.systemPrompt
        );

        finalResponse = followUpResult.response;
      }

      // Add assistant message to conversation
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: finalResponse,
        timestamp: new Date(),
        metadata: {
          toolCalls: toolCallResults,
          usage: geminiResult.usage,
        },
      };
      conversation.messages.push(assistantMessage);
      conversation.updatedAt = new Date();

      // Create response
      const response: ChatResponse = {
        id: assistantMessage.id,
        response: finalResponse,
        conversationId,
        timestamp: assistantMessage.timestamp,
        toolCalls: toolCallResults,
      };

      return response;
    } catch (error) {
      console.error('Error processing chat:', error);
      throw new Error(`Failed to process chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a conversation by ID
   */
  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  /**
   * Get all conversations for a user
   */
  getUserConversations(userId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId);
  }

  /**
   * Clear a conversation
   */
  clearConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  /**
   * Get agent health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    mcpConnected: boolean;
    availableTools: string[];
    conversationCount: number;
  }> {
    const mcpConnected = await this.mcpConnector.healthCheck();
    const availableTools = this.mcpConnector.getAvailableTools().map(t => t.name);

    return {
      status: mcpConnected ? 'healthy' : 'unhealthy',
      mcpConnected,
      availableTools,
      conversationCount: this.conversations.size,
    };
  }

  /**
   * Shutdown the agent
   */
  async shutdown(): Promise<void> {
    try {
      console.log('Shutting down AI Agent...');
      await this.mcpConnector.disconnect();
      this.conversations.clear();
      console.log('AI Agent shut down successfully');
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }

  /**
   * Update agent configuration
   */
  updateConfig(newConfig: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.geminiConfig) {
      this.geminiClient.updateConfig(newConfig.geminiConfig);
    }
  }

  /**
   * Get enabled tools based on configuration
   */
  private getEnabledTools() {
    const allTools = this.mcpConnector.getAvailableTools();
    
    if (this.config.enabledTools && this.config.enabledTools.length > 0) {
      return allTools.filter(tool => this.config.enabledTools.includes(tool.name));
    }
    
    return allTools;
  }

  /**
   * Get current configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Reconnect to MCP server if connection is lost
   */
  async reconnectMCP(): Promise<void> {
    await this.mcpConnector.reconnect();
  }
}