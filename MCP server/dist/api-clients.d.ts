import { User, UsersResponse, CompaniesResponse } from './types';
export declare class DummyJSONClient {
    private client;
    private companiesClient;
    private readonly baseURL;
    private readonly companiesBaseURL;
    private readonly bearerToken;
    constructor();
    /**
     * Get all users with optional pagination and field selection
     */
    getUsers(params?: {
        limit?: number;
        skip?: number;
        select?: string;
    }): Promise<UsersResponse>;
    /**
     * Get a single user by ID
     */
    getUserById(id: number, select?: string): Promise<User>;
    /**
     * Search users by query
     */
    searchUsers(params: {
        q: string;
        limit?: number;
        skip?: number;
    }): Promise<UsersResponse>;
    /**
     * Get users filtered by key-value pairs
     */
    filterUsers(filterKey: string, filterValue: string): Promise<UsersResponse>;
    /**
     * Get companies by name from the underwriting portal
     */
    getCompanies(companyName: string): Promise<CompaniesResponse>;
}
//# sourceMappingURL=api-clients.d.ts.map