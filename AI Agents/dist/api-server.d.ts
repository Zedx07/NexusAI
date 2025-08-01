export declare class APIServer {
    private app;
    private aiAgent;
    private port;
    constructor();
    /**
     * Setup Express middleware
     */
    private setupMiddleware;
    /**
     * Setup API routes
     */
    private setupRoutes;
    /**
     * Setup error handling middleware
     */
    private setupErrorHandling;
    /**
     * Start the server
     */
    start(): Promise<void>;
    /**
     * Graceful shutdown
     */
    private shutdown;
}
//# sourceMappingURL=api-server.d.ts.map