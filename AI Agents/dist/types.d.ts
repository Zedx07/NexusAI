import { z } from 'zod';
export declare const MessageSchema: z.ZodObject<{
    id: z.ZodString;
    role: z.ZodEnum<["user", "assistant", "system"]>;
    content: z.ZodString;
    timestamp: z.ZodDate;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
    metadata?: Record<string, any> | undefined;
}, {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
    metadata?: Record<string, any> | undefined;
}>;
export declare const ChatRequestSchema: z.ZodObject<{
    message: z.ZodString;
    conversationId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    conversationId?: string | undefined;
    userId?: string | undefined;
}, {
    message: string;
    conversationId?: string | undefined;
    userId?: string | undefined;
}>;
export declare const ChatResponseSchema: z.ZodObject<{
    id: z.ZodString;
    response: z.ZodString;
    conversationId: z.ZodString;
    timestamp: z.ZodDate;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        toolName: z.ZodString;
        arguments: z.ZodRecord<z.ZodString, z.ZodAny>;
        result: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        toolName: string;
        arguments: Record<string, any>;
        result?: any;
    }, {
        toolName: string;
        arguments: Record<string, any>;
        result?: any;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    timestamp: Date;
    conversationId: string;
    response: string;
    toolCalls?: {
        toolName: string;
        arguments: Record<string, any>;
        result?: any;
    }[] | undefined;
}, {
    id: string;
    timestamp: Date;
    conversationId: string;
    response: string;
    toolCalls?: {
        toolName: string;
        arguments: Record<string, any>;
        result?: any;
    }[] | undefined;
}>;
export declare const MCPToolSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    inputSchema: z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodRecord<z.ZodString, z.ZodAny>;
        required: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "object";
        properties: Record<string, any>;
        required?: string[] | undefined;
    }, {
        type: "object";
        properties: Record<string, any>;
        required?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: Record<string, any>;
        required?: string[] | undefined;
    };
}, {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: Record<string, any>;
        required?: string[] | undefined;
    };
}>;
export declare const MCPToolCallSchema: z.ZodObject<{
    name: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    arguments: Record<string, any>;
    name: string;
}, {
    arguments: Record<string, any>;
    name: string;
}>;
export declare const MCPToolResultSchema: z.ZodObject<{
    content: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "text";
        text: string;
    }, {
        type: "text";
        text: string;
    }>, "many">;
    isError: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: boolean | undefined;
}, {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: boolean | undefined;
}>;
export declare const GeminiConfigSchema: z.ZodObject<{
    apiKey: z.ZodString;
    model: z.ZodDefault<z.ZodString>;
    temperature: z.ZodDefault<z.ZodNumber>;
    maxTokens: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
}, {
    apiKey: string;
    model?: string | undefined;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
}>;
export declare const ConversationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        role: z.ZodEnum<["user", "assistant", "system"]>;
        content: z.ZodString;
        timestamp: z.ZodDate;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: Record<string, any> | undefined;
    }, {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: Record<string, any> | undefined;
    }>, "many">;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    messages: {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: Record<string, any> | undefined;
    }[];
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any> | undefined;
    userId?: string | undefined;
}, {
    id: string;
    messages: {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: Record<string, any> | undefined;
    }[];
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any> | undefined;
    userId?: string | undefined;
}>;
export declare const APIErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    details?: Record<string, any> | undefined;
}, {
    code: string;
    message: string;
    details?: Record<string, any> | undefined;
}>;
export type Message = z.infer<typeof MessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type MCPTool = z.infer<typeof MCPToolSchema>;
export type MCPToolCall = z.infer<typeof MCPToolCallSchema>;
export type MCPToolResult = z.infer<typeof MCPToolResultSchema>;
export type GeminiConfig = z.infer<typeof GeminiConfigSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type APIError = z.infer<typeof APIErrorSchema>;
export interface AgentConfig {
    name: string;
    description: string;
    systemPrompt: string;
    geminiConfig: GeminiConfig;
    mcpServerPath: string;
    enabledTools: string[];
}
//# sourceMappingURL=types.d.ts.map