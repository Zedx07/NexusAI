import { GeminiConfig, Message, MCPTool, MCPToolCall } from './types.js';
export declare class GeminiClient {
    private genAI;
    private model;
    private config;
    constructor(config: GeminiConfig);
    /**
     * Generate a response using Gemini with tool calling capabilities
     */
    generateResponse(messages: Message[], availableTools: MCPTool[], systemPrompt?: string): Promise<{
        response: string;
        toolCalls: MCPToolCall[];
        usage?: any;
    }>;
    /**
     * Generate a follow-up response after tool calls
     */
    generateFollowUpResponse(messages: Message[], toolCallResults: Array<{
        toolName: string;
        arguments: any;
        result: any;
    }>, systemPrompt?: string): Promise<{
        response: string;
        usage?: any;
    }>;
    /**
     * Format messages for Gemini's chat format
     */
    private formatMessagesForGemini;
    /**
     * Create function declarations for tool calling
     */
    private createFunctionDeclarations;
    /**
     * Format tool results for the follow-up prompt
     */
    private formatToolResults;
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<GeminiConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): GeminiConfig;
}
//# sourceMappingURL=gemini-client.d.ts.map