import { ChatRequest, ChatResponse, Conversation, AgentConfig } from './types.js';
export declare class AIAgent {
    private mcpConnector;
    private geminiClient;
    private conversations;
    private config;
    constructor(config: AgentConfig);
    /**
     * Initialize the AI agent
     */
    initialize(): Promise<void>;
    /**
     * Process a chat request and generate a response
     */
    processChat(request: ChatRequest): Promise<ChatResponse>;
    /**
     * Get a conversation by ID
     */
    getConversation(conversationId: string): Conversation | undefined;
    /**
     * Get all conversations for a user
     */
    getUserConversations(userId: string): Conversation[];
    /**
     * Clear a conversation
     */
    clearConversation(conversationId: string): boolean;
    /**
     * Get agent health status
     */
    getHealthStatus(): Promise<{
        status: 'healthy' | 'unhealthy';
        mcpConnected: boolean;
        availableTools: string[];
        conversationCount: number;
    }>;
    /**
     * Shutdown the agent
     */
    shutdown(): Promise<void>;
    /**
     * Update agent configuration
     */
    updateConfig(newConfig: Partial<AgentConfig>): void;
    /**
     * Get enabled tools based on configuration
     */
    private getEnabledTools;
    /**
     * Get current configuration
     */
    getConfig(): AgentConfig;
    /**
     * Reconnect to MCP server if connection is lost
     */
    reconnectMCP(): Promise<void>;
}
//# sourceMappingURL=ai-agent.d.ts.map