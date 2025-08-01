import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodNumber;
    firstName: z.ZodString;
    lastName: z.ZodString;
    maidenName: z.ZodString;
    age: z.ZodNumber;
    gender: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    birthDate: z.ZodString;
    image: z.ZodString;
    bloodGroup: z.ZodString;
    height: z.ZodNumber;
    weight: z.ZodNumber;
    eyeColor: z.ZodString;
    hair: z.ZodObject<{
        color: z.ZodString;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        color: string;
    }, {
        type: string;
        color: string;
    }>;
    ip: z.ZodString;
    address: z.ZodObject<{
        address: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        stateCode: z.ZodString;
        postalCode: z.ZodString;
        coordinates: z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            lat: number;
            lng: number;
        }, {
            lat: number;
            lng: number;
        }>;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        country: string;
    }, {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        country: string;
    }>;
    macAddress: z.ZodString;
    university: z.ZodString;
    bank: z.ZodObject<{
        cardExpire: z.ZodString;
        cardNumber: z.ZodString;
        cardType: z.ZodString;
        currency: z.ZodString;
        iban: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    }, {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    }>;
    company: z.ZodObject<{
        address: z.ZodObject<{
            address: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            stateCode: z.ZodString;
            postalCode: z.ZodString;
            coordinates: z.ZodObject<{
                lat: z.ZodNumber;
                lng: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                lat: number;
                lng: number;
            }, {
                lat: number;
                lng: number;
            }>;
            country: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        }, {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        }>;
        department: z.ZodString;
        name: z.ZodString;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
        department: string;
        name: string;
        title: string;
    }, {
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
        department: string;
        name: string;
        title: string;
    }>;
    ein: z.ZodString;
    ssn: z.ZodString;
    userAgent: z.ZodString;
    crypto: z.ZodObject<{
        coin: z.ZodString;
        wallet: z.ZodString;
        network: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        coin: string;
        wallet: string;
        network: string;
    }, {
        coin: string;
        wallet: string;
        network: string;
    }>;
    role: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: {
        type: string;
        color: string;
    };
    ip: string;
    address: {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        country: string;
    };
    macAddress: string;
    university: string;
    bank: {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    };
    company: {
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
        department: string;
        name: string;
        title: string;
    };
    ein: string;
    ssn: string;
    userAgent: string;
    crypto: {
        coin: string;
        wallet: string;
        network: string;
    };
    role: string;
}, {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: {
        type: string;
        color: string;
    };
    ip: string;
    address: {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        country: string;
    };
    macAddress: string;
    university: string;
    bank: {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    };
    company: {
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
        department: string;
        name: string;
        title: string;
    };
    ein: string;
    ssn: string;
    userAgent: string;
    crypto: {
        coin: string;
        wallet: string;
        network: string;
    };
    role: string;
}>;
export declare const UsersResponseSchema: z.ZodObject<{
    users: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        firstName: z.ZodString;
        lastName: z.ZodString;
        maidenName: z.ZodString;
        age: z.ZodNumber;
        gender: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        username: z.ZodString;
        password: z.ZodString;
        birthDate: z.ZodString;
        image: z.ZodString;
        bloodGroup: z.ZodString;
        height: z.ZodNumber;
        weight: z.ZodNumber;
        eyeColor: z.ZodString;
        hair: z.ZodObject<{
            color: z.ZodString;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            color: string;
        }, {
            type: string;
            color: string;
        }>;
        ip: z.ZodString;
        address: z.ZodObject<{
            address: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            stateCode: z.ZodString;
            postalCode: z.ZodString;
            coordinates: z.ZodObject<{
                lat: z.ZodNumber;
                lng: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                lat: number;
                lng: number;
            }, {
                lat: number;
                lng: number;
            }>;
            country: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        }, {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        }>;
        macAddress: z.ZodString;
        university: z.ZodString;
        bank: z.ZodObject<{
            cardExpire: z.ZodString;
            cardNumber: z.ZodString;
            cardType: z.ZodString;
            currency: z.ZodString;
            iban: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            cardExpire: string;
            cardNumber: string;
            cardType: string;
            currency: string;
            iban: string;
        }, {
            cardExpire: string;
            cardNumber: string;
            cardType: string;
            currency: string;
            iban: string;
        }>;
        company: z.ZodObject<{
            address: z.ZodObject<{
                address: z.ZodString;
                city: z.ZodString;
                state: z.ZodString;
                stateCode: z.ZodString;
                postalCode: z.ZodString;
                coordinates: z.ZodObject<{
                    lat: z.ZodNumber;
                    lng: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    lat: number;
                    lng: number;
                }, {
                    lat: number;
                    lng: number;
                }>;
                country: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                address: string;
                city: string;
                state: string;
                stateCode: string;
                postalCode: string;
                coordinates: {
                    lat: number;
                    lng: number;
                };
                country: string;
            }, {
                address: string;
                city: string;
                state: string;
                stateCode: string;
                postalCode: string;
                coordinates: {
                    lat: number;
                    lng: number;
                };
                country: string;
            }>;
            department: z.ZodString;
            name: z.ZodString;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            address: {
                address: string;
                city: string;
                state: string;
                stateCode: string;
                postalCode: string;
                coordinates: {
                    lat: number;
                    lng: number;
                };
                country: string;
            };
            department: string;
            name: string;
            title: string;
        }, {
            address: {
                address: string;
                city: string;
                state: string;
                stateCode: string;
                postalCode: string;
                coordinates: {
                    lat: number;
                    lng: number;
                };
                country: string;
            };
            department: string;
            name: string;
            title: string;
        }>;
        ein: z.ZodString;
        ssn: z.ZodString;
        userAgent: z.ZodString;
        crypto: z.ZodObject<{
            coin: z.ZodString;
            wallet: z.ZodString;
            network: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            coin: string;
            wallet: string;
            network: string;
        }, {
            coin: string;
            wallet: string;
            network: string;
        }>;
        role: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        firstName: string;
        lastName: string;
        maidenName: string;
        age: number;
        gender: string;
        email: string;
        phone: string;
        username: string;
        password: string;
        birthDate: string;
        image: string;
        bloodGroup: string;
        height: number;
        weight: number;
        eyeColor: string;
        hair: {
            type: string;
            color: string;
        };
        ip: string;
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
        macAddress: string;
        university: string;
        bank: {
            cardExpire: string;
            cardNumber: string;
            cardType: string;
            currency: string;
            iban: string;
        };
        company: {
            address: {
                address: string;
                city: string;
                state: string;
                stateCode: string;
                postalCode: string;
                coordinates: {
                    lat: number;
                    lng: number;
                };
                country: string;
            };
            department: string;
            name: string;
            title: string;
        };
        ein: string;
        ssn: string;
        userAgent: string;
        crypto: {
            coin: string;
            wallet: string;
            network: string;
        };
        role: string;
    }, {
        id: number;
        firstName: string;
        lastName: string;
        maidenName: string;
        age: number;
        gender: string;
        email: string;
        phone: string;
        username: string;
        password: string;
        birthDate: string;
        image: string;
        bloodGroup: string;
        height: number;
        weight: number;
        eyeColor: string;
        hair: {
            type: string;
            color: string;
        };
        ip: string;
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
        macAddress: string;
        university: string;
        bank: {
            cardExpire: string;
            cardNumber: string;
            cardType: string;
            currency: string;
            iban: string;
        };
        company: {
            address: {
                address: string;
                city: string;
                state: string;
                stateCode: string;
                postalCode: string;
                coordinates: {
                    lat: number;
                    lng: number;
                };
                country: string;
            };
            department: string;
            name: string;
            title: string;
        };
        ein: string;
        ssn: string;
        userAgent: string;
        crypto: {
            coin: string;
            wallet: string;
            network: string;
        };
        role: string;
    }>, "many">;
    total: z.ZodNumber;
    skip: z.ZodNumber;
    limit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    users: {
        id: number;
        firstName: string;
        lastName: string;
        maidenName: string;
        age: number;
        gender: string;
        email: string;
        phone: string;
        username: string;
        password: string;
        birthDate: string;
        image: string;
        bloodGroup: string;
        height: number;
        weight: number;
        eyeColor: string;
        hair: {
            type: string;
            color: string;
        };
        ip: string;
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
        macAddress: string;
        university: string;
        bank: {
            cardExpire: string;
            cardNumber: string;
            cardType: string;
            currency: string;
            iban: string;
        };
        company: {
            address: {
                address: string;
                city: string;
                state: string;
                stateCode: string;
                postalCode: string;
                coordinates: {
                    lat: number;
                    lng: number;
                };
                country: string;
            };
            department: string;
            name: string;
            title: string;
        };
        ein: string;
        ssn: string;
        userAgent: string;
        crypto: {
            coin: string;
            wallet: string;
            network: string;
        };
        role: string;
    }[];
    total: number;
    skip: number;
    limit: number;
}, {
    users: {
        id: number;
        firstName: string;
        lastName: string;
        maidenName: string;
        age: number;
        gender: string;
        email: string;
        phone: string;
        username: string;
        password: string;
        birthDate: string;
        image: string;
        bloodGroup: string;
        height: number;
        weight: number;
        eyeColor: string;
        hair: {
            type: string;
            color: string;
        };
        ip: string;
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
        macAddress: string;
        university: string;
        bank: {
            cardExpire: string;
            cardNumber: string;
            cardType: string;
            currency: string;
            iban: string;
        };
        company: {
            address: {
                address: string;
                city: string;
                state: string;
                stateCode: string;
                postalCode: string;
                coordinates: {
                    lat: number;
                    lng: number;
                };
                country: string;
            };
            department: string;
            name: string;
            title: string;
        };
        ein: string;
        ssn: string;
        userAgent: string;
        crypto: {
            coin: string;
            wallet: string;
            network: string;
        };
        role: string;
    }[];
    total: number;
    skip: number;
    limit: number;
}>;
export type User = z.infer<typeof UserSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
export declare const GetUsersArgsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    skip: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    select: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skip: number;
    limit: number;
    select?: string | undefined;
}, {
    skip?: number | undefined;
    limit?: number | undefined;
    select?: string | undefined;
}>;
export declare const GetUserByIdArgsSchema: z.ZodObject<{
    id: z.ZodNumber;
    select: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    select?: string | undefined;
}, {
    id: number;
    select?: string | undefined;
}>;
export declare const SearchUsersArgsSchema: z.ZodObject<{
    q: z.ZodString;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    skip: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    skip: number;
    limit: number;
    q: string;
}, {
    q: string;
    skip?: number | undefined;
    limit?: number | undefined;
}>;
export type GetUsersArgs = z.infer<typeof GetUsersArgsSchema>;
export type GetUserByIdArgs = z.infer<typeof GetUserByIdArgsSchema>;
export type SearchUsersArgs = z.infer<typeof SearchUsersArgsSchema>;
//# sourceMappingURL=types.d.ts.map