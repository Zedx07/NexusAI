import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { GeminiConfig, Message, MCPTool, MCPToolCall } from './types.js';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: config.model,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
    });
  }

  /**
   * Generate a response using Gemini with tool calling capabilities
   */
  async generateResponse(
    messages: Message[],
    availableTools: MCPTool[],
    systemPrompt?: string
  ): Promise<{
    response: string;
    toolCalls: MCPToolCall[];
    usage?: any;
  }> {
    try {
      // Prepare the conversation history
      const conversationHistory = this.formatMessagesForGemini(messages, systemPrompt);
      
      // Create function declarations for tool calling
      const functionDeclarations = this.createFunctionDeclarations(availableTools);
      
      const chat = this.model.startChat({
        history: conversationHistory.slice(0, -1), // All but the last message
        tools: functionDeclarations.length > 0 ? [{ functionDeclarations }] : undefined,
      });

      // Send the latest message
      const latestMessage = conversationHistory[conversationHistory.length - 1];
      const result = await chat.sendMessage(latestMessage.parts[0].text);
      
      const response = await result.response;
      
      // Check if the model wants to call functions
      const toolCalls: MCPToolCall[] = [];
      let responseText = '';

      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        // Extract tool calls
        for (const functionCall of functionCalls) {
          toolCalls.push({
            name: functionCall.name,
            arguments: functionCall.args || {},
          });
        }
        responseText = 'I need to fetch some information for you. Let me check...';
      } else {
        responseText = response.text() || 'I apologize, but I couldn\'t generate a response.';
      }

      return {
        response: responseText,
        toolCalls,
        usage: response.usageMetadata,
      };
    } catch (error) {
      console.error('Error generating response with Gemini:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a follow-up response after tool calls
   */
  async generateFollowUpResponse(
    messages: Message[],
    toolCallResults: Array<{ toolName: string; arguments: any; result: any }>,
    systemPrompt?: string
  ): Promise<{
    response: string;
    usage?: any;
  }> {
    try {
      // Format the conversation with tool results
      const conversationHistory = this.formatMessagesForGemini(messages, systemPrompt);
      
      // Add tool results to the conversation
      const toolResultsText = this.formatToolResults(toolCallResults);
      conversationHistory.push({
        role: 'user',
        parts: [{ text: `Tool results: ${toolResultsText}\n\nPlease provide a comprehensive response based on this information.` }],
      });

      const chat = this.model.startChat({
        history: conversationHistory.slice(0, -1),
      });

      const result = await chat.sendMessage(conversationHistory[conversationHistory.length - 1].parts[0].text);
      const response = await result.response;

      return {
        response: response.text() || 'I apologize, but I couldn\'t process the tool results.',
        usage: response.usageMetadata,
      };
    } catch (error) {
      console.error('Error generating follow-up response:', error);
      throw new Error(`Failed to generate follow-up response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Format messages for Gemini's chat format
   */
  private formatMessagesForGemini(messages: Message[], systemPrompt?: string): any[] {
    const formattedMessages: any[] = [];

    // Add system prompt as the first user message if provided
    if (systemPrompt) {
      formattedMessages.push({
        role: 'user',
        parts: [{ text: `System: ${systemPrompt}` }],
      });
      formattedMessages.push({
        role: 'model',
        parts: [{ text: 'I understand. I\'ll follow these instructions.' }],
      });
    }

    // Convert messages to Gemini format
    for (const message of messages) {
      let geminiRole: 'user' | 'model' = 'user';
      
      // Map roles to Gemini's expected format
      if (message.role === 'assistant') {
        geminiRole = 'model';
      } else if (message.role === 'system') {
        // System messages are handled separately
        continue;
      } else {
        geminiRole = 'user';
      }

      formattedMessages.push({
        role: geminiRole,
        parts: [{ text: message.content }],
      });
    }

    return formattedMessages;
  }

  /**
   * Create function declarations for tool calling
   */
  private createFunctionDeclarations(tools: MCPTool[]): any[] {
    return tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    }));
  }

  /**
   * Format tool results for the follow-up prompt
   */
  private formatToolResults(results: Array<{ toolName: string; arguments: any; result: any }>): string {
    return results.map(({ toolName, arguments: args, result }) => {
      let resultText = '';
      if (result.content && Array.isArray(result.content)) {
        resultText = result.content
          .filter((item: any) => item.type === 'text')
          .map((item: any) => item.text)
          .join('\n');
      } else {
        resultText = JSON.stringify(result);
      }

      return `Tool: ${toolName}
Arguments: ${JSON.stringify(args, null, 2)}
Result: ${resultText}
---`;
    }).join('\n');
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<GeminiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Recreate the model if API key or model name changed
    if (newConfig.apiKey || newConfig.model) {
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: this.config.model,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
        },
      });
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): GeminiConfig {
    return { ...this.config };
  }
}