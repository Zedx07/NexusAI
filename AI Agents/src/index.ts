#!/usr/bin/env node

import { APIServer } from './api-server.js';

/**
 * Main entry point for the AI Agents service
 */
async function main() {
  try {
    console.log('🤖 Starting AI Agents service...');
    
    const server = new APIServer();
    await server.start();
  } catch (error) {
    console.error('❌ Failed to start AI Agents service:', error);
    process.exit(1);
  }
}

// Start the service
main();