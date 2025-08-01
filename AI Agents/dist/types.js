"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIErrorSchema = exports.ConversationSchema = exports.GeminiConfigSchema = exports.MCPToolResultSchema = exports.MCPToolCallSchema = exports.MCPToolSchema = exports.ChatResponseSchema = exports.ChatRequestSchema = exports.MessageSchema = void 0;
const zod_1 = require("zod");
// Chat message types
exports.MessageSchema = zod_1.z.object({
    id: zod_1.z.string(),
    role: zod_1.z.enum(['user', 'assistant', 'system']),
    content: zod_1.z.string(),
    timestamp: zod_1.z.date(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.ChatRequestSchema = zod_1.z.object({
    message: zod_1.z.string().min(1),
    conversationId: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
});
exports.ChatResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    response: zod_1.z.string(),
    conversationId: zod_1.z.string(),
    timestamp: zod_1.z.date(),
    toolCalls: zod_1.z.array(zod_1.z.object({
        toolName: zod_1.z.string(),
        arguments: zod_1.z.record(zod_1.z.any()),
        result: zod_1.z.any(),
    })).optional(),
});
// MCP Tool types
exports.MCPToolSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    inputSchema: zod_1.z.object({
        type: zod_1.z.literal('object'),
        properties: zod_1.z.record(zod_1.z.any()),
        required: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.MCPToolCallSchema = zod_1.z.object({
    name: zod_1.z.string(),
    arguments: zod_1.z.record(zod_1.z.any()),
});
exports.MCPToolResultSchema = zod_1.z.object({
    content: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.literal('text'),
        text: zod_1.z.string(),
    })),
    isError: zod_1.z.boolean().optional(),
});
// Gemini integration types
exports.GeminiConfigSchema = zod_1.z.object({
    apiKey: zod_1.z.string(),
    model: zod_1.z.string().default('gemini-1.5-pro'),
    temperature: zod_1.z.number().min(0).max(2).default(0.7),
    maxTokens: zod_1.z.number().positive().default(8192),
});
// Conversation management
exports.ConversationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string().optional(),
    messages: zod_1.z.array(exports.MessageSchema),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// Error types
exports.APIErrorSchema = zod_1.z.object({
    code: zod_1.z.string(),
    message: zod_1.z.string(),
    details: zod_1.z.record(zod_1.z.any()).optional(),
});
//# sourceMappingURL=types.js.map