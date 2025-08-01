"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompaniesArgsSchema = exports.CompaniesResponseSchema = exports.CompanySchema = exports.SearchUsersArgsSchema = exports.GetUserByIdArgsSchema = exports.GetUsersArgsSchema = exports.UsersResponseSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
// DummyJSON User Schema
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.number(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    maidenName: zod_1.z.string(),
    age: zod_1.z.number(),
    gender: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    birthDate: zod_1.z.string(),
    image: zod_1.z.string().url(),
    bloodGroup: zod_1.z.string(),
    height: zod_1.z.number(),
    weight: zod_1.z.number(),
    eyeColor: zod_1.z.string(),
    hair: zod_1.z.object({
        color: zod_1.z.string(),
        type: zod_1.z.string(),
    }),
    ip: zod_1.z.string(),
    address: zod_1.z.object({
        address: zod_1.z.string(),
        city: zod_1.z.string(),
        state: zod_1.z.string(),
        stateCode: zod_1.z.string(),
        postalCode: zod_1.z.string(),
        coordinates: zod_1.z.object({
            lat: zod_1.z.number(),
            lng: zod_1.z.number(),
        }),
        country: zod_1.z.string(),
    }),
    macAddress: zod_1.z.string(),
    university: zod_1.z.string(),
    bank: zod_1.z.object({
        cardExpire: zod_1.z.string(),
        cardNumber: zod_1.z.string(),
        cardType: zod_1.z.string(),
        currency: zod_1.z.string(),
        iban: zod_1.z.string(),
    }),
    company: zod_1.z.object({
        address: zod_1.z.object({
            address: zod_1.z.string(),
            city: zod_1.z.string(),
            state: zod_1.z.string(),
            stateCode: zod_1.z.string(),
            postalCode: zod_1.z.string(),
            coordinates: zod_1.z.object({
                lat: zod_1.z.number(),
                lng: zod_1.z.number(),
            }),
            country: zod_1.z.string(),
        }),
        department: zod_1.z.string(),
        name: zod_1.z.string(),
        title: zod_1.z.string(),
    }),
    ein: zod_1.z.string(),
    ssn: zod_1.z.string(),
    userAgent: zod_1.z.string(),
    crypto: zod_1.z.object({
        coin: zod_1.z.string(),
        wallet: zod_1.z.string(),
        network: zod_1.z.string(),
    }),
    role: zod_1.z.string(),
});
exports.UsersResponseSchema = zod_1.z.object({
    users: zod_1.z.array(exports.UserSchema),
    total: zod_1.z.number(),
    skip: zod_1.z.number(),
    limit: zod_1.z.number(),
});
// Tool argument schemas
exports.GetUsersArgsSchema = zod_1.z.object({
    limit: zod_1.z.number().min(1).max(100).optional().default(30).describe('Number of users to fetch (1-100)'),
    skip: zod_1.z.number().min(0).optional().default(0).describe('Number of users to skip for pagination'),
    select: zod_1.z.string().optional().describe('Comma-separated list of fields to select (e.g., "firstName,lastName,email")'),
});
exports.GetUserByIdArgsSchema = zod_1.z.object({
    id: zod_1.z.number().min(1).max(208).describe('User ID (1-208)'),
    select: zod_1.z.string().optional().describe('Comma-separated list of fields to select'),
});
exports.SearchUsersArgsSchema = zod_1.z.object({
    q: zod_1.z.string().min(1).describe('Search query to filter users'),
    limit: zod_1.z.number().min(1).max(100).optional().default(30).describe('Number of users to fetch'),
    skip: zod_1.z.number().min(0).optional().default(0).describe('Number of users to skip'),
});
// Company API schemas
exports.CompanySchema = zod_1.z.object({
    id: zod_1.z.string().or(zod_1.z.number()).optional(),
    name: zod_1.z.string(),
    // Add more fields as needed based on actual API response
}).passthrough(); // Allow additional fields that might be returned by the API
exports.CompaniesResponseSchema = zod_1.z.object({
    companies: zod_1.z.array(exports.CompanySchema).optional(),
    data: zod_1.z.array(exports.CompanySchema).optional(),
    // Support different response formats
}).passthrough();
exports.GetCompaniesArgsSchema = zod_1.z.object({
    company_name: zod_1.z.string().min(1).describe('Company name to search for'),
});
//# sourceMappingURL=types.js.map