"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = require("dotenv");
const ai_agent_js_1 = require("./ai-agent.js");
const types_js_1 = require("./types.js");
const zod_1 = require("zod");
// Load environment variables
(0, dotenv_1.config)();
class APIServer {
    app;
    aiAgent;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || '3001');
        // Initialize AI Agent with configuration
        const agentConfig = {
            name: 'Jake Assistant',
            description: 'AI Assistant with access to user data via MCP',
            systemPrompt: `You are Jake, a helpful AI assistant with access to user data through various tools. 
      You can help users find information about people, search through user databases, and provide insights.
      Always be helpful, accurate, and respectful of user privacy.
      When using tools, explain what you're doing and why.`,
            geminiConfig: {
                apiKey: process.env.GEMINI_API_KEY || '',
                model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
                temperature: 0.7,
                maxTokens: 8192,
            },
            mcpServerPath: process.env.MCP_SERVER_PATH || '../MCP server/dist/index.js',
            enabledTools: [], // Empty array means all tools are enabled
        };
        this.aiAgent = new ai_agent_js_1.AIAgent(agentConfig);
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)());
        // CORS configuration
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
        }));
        // Body parsing middleware
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Request logging middleware
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }
    /**
     * Setup API routes
     */
    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', async (req, res) => {
            try {
                const healthStatus = await this.aiAgent.getHealthStatus();
                res.json({
                    status: 'ok',
                    timestamp: new Date().toISOString(),
                    agent: healthStatus,
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: 'Health check failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        });
        // Chat endpoint
        this.app.post('/chat', async (req, res, next) => {
            try {
                // Validate request body
                const chatRequest = types_js_1.ChatRequestSchema.parse(req.body);
                // Process chat with AI agent
                const response = await this.aiAgent.processChat(chatRequest);
                res.json({
                    success: true,
                    data: response,
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Get conversation endpoint
        this.app.get('/conversations/:conversationId', (req, res) => {
            try {
                const { conversationId } = req.params;
                const conversation = this.aiAgent.getConversation(conversationId);
                if (!conversation) {
                    return res.status(404).json({
                        success: false,
                        error: {
                            code: 'CONVERSATION_NOT_FOUND',
                            message: 'Conversation not found',
                        },
                    });
                }
                res.json({
                    success: true,
                    data: conversation,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });
        // Get user conversations endpoint
        this.app.get('/users/:userId/conversations', (req, res) => {
            try {
                const { userId } = req.params;
                const conversations = this.aiAgent.getUserConversations(userId);
                res.json({
                    success: true,
                    data: conversations,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });
        // Clear conversation endpoint
        this.app.delete('/conversations/:conversationId', (req, res) => {
            try {
                const { conversationId } = req.params;
                const deleted = this.aiAgent.clearConversation(conversationId);
                if (!deleted) {
                    return res.status(404).json({
                        success: false,
                        error: {
                            code: 'CONVERSATION_NOT_FOUND',
                            message: 'Conversation not found',
                        },
                    });
                }
                res.json({
                    success: true,
                    message: 'Conversation cleared successfully',
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });
        // Get available tools endpoint
        this.app.get('/tools', (req, res) => {
            try {
                const tools = this.aiAgent['mcpConnector'].getAvailableTools();
                res.json({
                    success: true,
                    data: tools,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });
        // Reconnect MCP endpoint (for debugging/maintenance)
        this.app.post('/admin/reconnect-mcp', async (req, res) => {
            try {
                await this.aiAgent.reconnectMCP();
                res.json({
                    success: true,
                    message: 'MCP connection reestablished',
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'RECONNECT_FAILED',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });
        // Agent config endpoint
        this.app.get('/config', (req, res) => {
            try {
                const config = this.aiAgent.getConfig();
                // Remove sensitive information
                const safeConfig = {
                    ...config,
                    geminiConfig: {
                        ...config.geminiConfig,
                        apiKey: '[REDACTED]',
                    },
                };
                res.json({
                    success: true,
                    data: safeConfig,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });
        // 404 handler for undefined routes
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    code: 'ROUTE_NOT_FOUND',
                    message: `Route ${req.method} ${req.originalUrl} not found`,
                },
            });
        });
    }
    /**
     * Setup error handling middleware
     */
    setupErrorHandling() {
        this.app.use((error, req, res, next) => {
            console.error('API Error:', error);
            // Zod validation errors
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid request data',
                        details: error.errors,
                    },
                });
            }
            // Generic error response
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                },
            });
        });
    }
    /**
     * Start the server
     */
    async start() {
        try {
            // Initialize the AI agent first
            await this.aiAgent.initialize();
            // Start the HTTP server
            this.app.listen(this.port, () => {
                console.log(`🚀 API Server running on port ${this.port}`);
                console.log(`📊 Health check: http://localhost:${this.port}/health`);
                console.log(`💬 Chat endpoint: http://localhost:${this.port}/chat`);
            });
            // Graceful shutdown handling
            process.on('SIGTERM', this.shutdown.bind(this));
            process.on('SIGINT', this.shutdown.bind(this));
        }
        catch (error) {
            console.error('Failed to start API server:', error);
            process.exit(1);
        }
    }
    /**
     * Graceful shutdown
     */
    async shutdown() {
        console.log('\n🛑 Shutting down API server...');
        try {
            await this.aiAgent.shutdown();
            console.log('✅ API server shut down successfully');
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Error during shutdown:', error);
            process.exit(1);
        }
    }
}
exports.APIServer = APIServer;
//# sourceMappingURL=api-server.js.map