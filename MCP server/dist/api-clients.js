"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyJSONClient = void 0;
const axios_1 = __importDefault(require("axios"));
const types_1 = require("./types");
class DummyJSONClient {
    client;
    companiesClient;
    baseURL = 'https://dummyjson.com';
    companiesBaseURL = 'https://underwritingportal.orion.insurancearticlez.com';
    bearerToken = 'your-hardcoded-token-here'; // Replace with actual token
    constructor() {
        this.client = axios_1.default.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MCP-Server-Jake/1.0.0',
            },
        });
        // Create separate client for companies API
        this.companiesClient = axios_1.default.create({
            baseURL: this.companiesBaseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.bearerToken}`,
                'accept': 'application/json',
            },
        });
        // Add request interceptor for logging
        this.client.interceptors.request.use((config) => {
            console.log(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            console.error('Request error:', error);
            return Promise.reject(error);
        });
        // Add response interceptor for error handling
        this.client.interceptors.response.use((response) => {
            console.log(`Response received: ${response.status} ${response.statusText}`);
            return response;
        }, (error) => {
            console.error('Response error:', error.response?.status, error.response?.statusText);
            return Promise.reject(error);
        });
        // Add interceptors for companies client
        this.companiesClient.interceptors.request.use((config) => {
            console.log(`Making companies request to: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            console.error('Companies request error:', error);
            return Promise.reject(error);
        });
        this.companiesClient.interceptors.response.use((response) => {
            console.log(`Companies response received: ${response.status} ${response.statusText}`);
            return response;
        }, (error) => {
            console.error('Companies response error:', error.response?.status, error.response?.statusText);
            return Promise.reject(error);
        });
    }
    /**
     * Get all users with optional pagination and field selection
     */
    async getUsers(params) {
        try {
            const queryParams = new URLSearchParams();
            if (params?.limit)
                queryParams.append('limit', params.limit.toString());
            if (params?.skip)
                queryParams.append('skip', params.skip.toString());
            if (params?.select)
                queryParams.append('select', params.select);
            const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await this.client.get(url);
            // Validate response with Zod
            const validatedData = types_1.UsersResponseSchema.parse(response.data);
            return validatedData;
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get a single user by ID
     */
    async getUserById(id, select) {
        try {
            const queryParams = new URLSearchParams();
            if (select)
                queryParams.append('select', select);
            const url = `/users/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await this.client.get(url);
            // Validate response with Zod
            const validatedUser = types_1.UserSchema.parse(response.data);
            return validatedUser;
        }
        catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            throw new Error(`Failed to fetch user ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Search users by query
     */
    async searchUsers(params) {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('q', params.q);
            if (params.limit)
                queryParams.append('limit', params.limit.toString());
            if (params.skip)
                queryParams.append('skip', params.skip.toString());
            const url = `/users/search?${queryParams.toString()}`;
            const response = await this.client.get(url);
            // Validate response with Zod
            const validatedData = types_1.UsersResponseSchema.parse(response.data);
            return validatedData;
        }
        catch (error) {
            console.error('Error searching users:', error);
            throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get users filtered by key-value pairs
     */
    async filterUsers(filterKey, filterValue) {
        try {
            const url = `/users/filter?key=${filterKey}&value=${filterValue}`;
            const response = await this.client.get(url);
            // Validate response with Zod
            const validatedData = types_1.UsersResponseSchema.parse(response.data);
            return validatedData;
        }
        catch (error) {
            console.error('Error filtering users:', error);
            throw new Error(`Failed to filter users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get companies by name from the underwriting portal
     */
    async getCompanies(companyName) {
        try {
            const url = '/api/Customer/GetCompanies';
            const requestBody = {
                company_name: companyName
            };
            const response = await this.companiesClient.post(url, requestBody);
            // Validate response with Zod (allowing for flexible structure)
            const validatedData = types_1.CompaniesResponseSchema.parse(response.data);
            return validatedData;
        }
        catch (error) {
            console.error('Error fetching companies:', error);
            throw new Error(`Failed to fetch companies: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.DummyJSONClient = DummyJSONClient;
//# sourceMappingURL=api-clients.js.map