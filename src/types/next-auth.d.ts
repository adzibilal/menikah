// types/next-auth.d.ts
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        role: string;
        name: string;
        email: string;
    }

    interface Session extends DefaultSession {
        user: DefaultSession['user'] & {
            id: string; 
            role: string; 
            name: string;
            email: string;
        };
    }

    interface CredentialsInputs {
        email: string;
        password: string;
    }
}
