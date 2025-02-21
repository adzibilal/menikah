import { Users } from '@/db/schema';
import { InferModel } from 'drizzle-orm';

export type User = InferModel<typeof Users>;
export type NewUser = Omit<User, 'user_id' | 'created_at' | 'password_hash'> & {
    password: string;
};

export type CreateUser = Omit<User, 'user_id' | 'created_at'> & {
    password: string;
};
export type UpdateUser = Partial<Omit<User, 'user_id' | 'created_at'>> & {
    password?: string;
};
