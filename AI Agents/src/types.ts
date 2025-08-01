import { z } from 'zod';

// Chat message types
export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date(),
  metadata: z.record(z.any()).optional(),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
});

export const ChatResponseSchema = z.object({
  id: z.string(),
  response: z.string(),
  conversationId: z.string(),
  timestamp: z.date(),
  toolCalls: z.array(z.object({
    toolName: z.string(),
    arguments: z.record(z.any()),
    result: z.any(),
  })).optional(),
});

// MCP Tool types
export const MCPToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.object({
    type: z.literal('object'),
    properties: z.record(z.any()),
    required: z.array(z.string()).optional(),
  }),
});

export const MCPToolCallSchema = z.object({
  name: z.string(),
  arguments: z.record(z.any()),
});

export const MCPToolResultSchema = z.object({
  content: z.array(z.object({
    type: z.literal('text'),
    text: z.string(),
  })),
  isError: z.boolean().optional(),
});

// Gemini integration types
export const GeminiConfigSchema = z.object({
  apiKey: z.string(),
  model: z.string().default('gemini-1.5-pro'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(8192),
});

// Conversation management
export const ConversationSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  messages: z.array(MessageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  metadata: z.record(z.any()).optional(),
});

// Error types
export const APIErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
});

// Type exports
export type Message = z.infer<typeof MessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type MCPTool = z.infer<typeof MCPToolSchema>;
export type MCPToolCall = z.infer<typeof MCPToolCallSchema>;
export type MCPToolResult = z.infer<typeof MCPToolResultSchema>;
export type GeminiConfig = z.infer<typeof GeminiConfigSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type APIError = z.infer<typeof APIErrorSchema>;

// Agent configuration
export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  geminiConfig: GeminiConfig;
  mcpServerPath: string;
  enabledTools: string[];
}