import { z } from 'zod';

// DummyJSON User Schema
export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string(),
  age: z.number(),
  gender: z.string(),
  email: z.string().email(),
  phone: z.string(),
  username: z.string(),
  password: z.string(),
  birthDate: z.string(),
  image: z.string().url(),
  bloodGroup: z.string(),
  height: z.number(),
  weight: z.number(),
  eyeColor: z.string(),
  hair: z.object({
    color: z.string(),
    type: z.string(),
  }),
  ip: z.string(),
  address: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    stateCode: z.string(),
    postalCode: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    country: z.string(),
  }),
  macAddress: z.string(),
  university: z.string(),
  bank: z.object({
    cardExpire: z.string(),
    cardNumber: z.string(),
    cardType: z.string(),
    currency: z.string(),
    iban: z.string(),
  }),
  company: z.object({
    address: z.object({
      address: z.string(),
      city: z.string(),
      state: z.string(),
      stateCode: z.string(),
      postalCode: z.string(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      country: z.string(),
    }),
    department: z.string(),
    name: z.string(),
    title: z.string(),
  }),
  ein: z.string(),
  ssn: z.string(),
  userAgent: z.string(),
  crypto: z.object({
    coin: z.string(),
    wallet: z.string(),
    network: z.string(),
  }),
  role: z.string(),
});

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type User = z.infer<typeof UserSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;

// Tool argument schemas
export const GetUsersArgsSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(30).describe('Number of users to fetch (1-100)'),
  skip: z.number().min(0).optional().default(0).describe('Number of users to skip for pagination'),
  select: z.string().optional().describe('Comma-separated list of fields to select (e.g., "firstName,lastName,email")'),
});

export const GetUserByIdArgsSchema = z.object({
  id: z.number().min(1).max(208).describe('User ID (1-208)'),
  select: z.string().optional().describe('Comma-separated list of fields to select'),
});

export const SearchUsersArgsSchema = z.object({
  q: z.string().min(1).describe('Search query to filter users'),
  limit: z.number().min(1).max(100).optional().default(30).describe('Number of users to fetch'),
  skip: z.number().min(0).optional().default(0).describe('Number of users to skip'),
});

export type GetUsersArgs = z.infer<typeof GetUsersArgsSchema>;
export type GetUserByIdArgs = z.infer<typeof GetUserByIdArgsSchema>;
export type SearchUsersArgs = z.infer<typeof SearchUsersArgsSchema>;