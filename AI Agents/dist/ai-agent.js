"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgent = void 0;
const uuid_1 = require("uuid");
const mcp_connector_js_1 = require("./mcp-connector.js");
const gemini_client_js_1 = require("./gemini-client.js");
class AIAgent {
    mcpConnector;
    geminiClient;
    conversations = new Map();
    config;
    constructor(config) {
        this.config = config;
        this.mcpConnector = new mcp_connector_js_1.MCPConnector(config.mcpServerPath);
        this.geminiClient = new gemini_client_js_1.GeminiClient(config.geminiConfig);
    }
    /**
     * Initialize the AI agent
     */
    async initialize() {
        try {
            console.log('Initializing AI Agent...');
            // Connect to MCP server
            await this.mcpConnector.connect();
            console.log('AI Agent initialized successfully');
            console.log('Available tools:', this.mcpConnector.getAvailableTools().map(t => t.name));
        }
        catch (error) {
            console.error('Failed to initialize AI Agent:', error);
            throw error;
        }
    }
    /**
     * Process a chat request and generate a response
     */
    async processChat(request) {
        try {
            const conversationId = request.conversationId || (0, uuid_1.v4)();
            const messageId = (0, uuid_1.v4)();
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
            const userMessage = {
                id: messageId,
                role: 'user',
                content: request.message,
                timestamp: new Date(),
            };
            conversation.messages.push(userMessage);
            // Get available tools (filtered by enabled tools if specified)
            const availableTools = this.getEnabledTools();
            // Generate initial response with Gemini
            const geminiResult = await this.geminiClient.generateResponse(conversation.messages, availableTools, this.config.systemPrompt);
            let finalResponse = geminiResult.response;
            const toolCallResults = [];
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
                const followUpResult = await this.geminiClient.generateFollowUpResponse(conversation.messages, toolCallResults, this.config.systemPrompt);
                finalResponse = followUpResult.response;
            }
            // Add assistant message to conversation
            const assistantMessage = {
                id: (0, uuid_1.v4)(),
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
            const response = {
                id: assistantMessage.id,
                response: finalResponse,
                conversationId,
                timestamp: assistantMessage.timestamp,
                toolCalls: toolCallResults,
            };
            return response;
        }
        catch (error) {
            console.error('Error processing chat:', error);
            throw new Error(`Failed to process chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get a conversation by ID
     */
    getConversation(conversationId) {
        return this.conversations.get(conversationId);
    }
    /**
     * Get all conversations for a user
     */
    getUserConversations(userId) {
        return Array.from(this.conversations.values())
            .filter(conv => conv.userId === userId);
    }
    /**
     * Clear a conversation
     */
    clearConversation(conversationId) {
        return this.conversations.delete(conversationId);
    }
    /**
     * Get agent health status
     */
    async getHealthStatus() {
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
    async shutdown() {
        try {
            console.log('Shutting down AI Agent...');
            await this.mcpConnector.disconnect();
            this.conversations.clear();
            console.log('AI Agent shut down successfully');
        }
        catch (error) {
            console.error('Error during shutdown:', error);
        }
    }
    /**
     * Update agent configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (newConfig.geminiConfig) {
            this.geminiClient.updateConfig(newConfig.geminiConfig);
        }
    }
    /**
     * Get enabled tools based on configuration
     */
    getEnabledTools() {
        const allTools = this.mcpConnector.getAvailableTools();
        if (this.config.enabledTools && this.config.enabledTools.length > 0) {
            return allTools.filter(tool => this.config.enabledTools.includes(tool.name));
        }
        return allTools;
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Reconnect to MCP server if connection is lost
     */
    async reconnectMCP() {
        await this.mcpConnector.reconnect();
    }
}
exports.AIAgent = AIAgent;
//# sourceMappingURL=ai-agent.js.map