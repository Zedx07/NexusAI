#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_server_js_1 = require("./api-server.js");
/**
 * Main entry point for the AI Agents service
 */
async function main() {
    try {
        console.log('🤖 Starting AI Agents service...');
        const server = new api_server_js_1.APIServer();
        await server.start();
    }
    catch (error) {
        console.error('❌ Failed to start AI Agents service:', error);
        process.exit(1);
    }
}
// Start the service
main();
//# sourceMappingURL=index.js.map