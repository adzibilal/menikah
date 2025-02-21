import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Users } from '@/db/schema';
import { hash } from 'bcryptjs';
import { CreateUser } from '@/types/user';
import { BaseAPIResponse } from '@/types/common';
import { sql, ilike } from 'drizzle-orm';
import { parseAlredyExist } from '@/lib/utils';

// GET all users with pagination and search
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('per_page')) || 10;
        const search = searchParams.get('search') || '';
        
        const offset = (page - 1) * limit;

        // Get total count with search
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(Users)
            .where(
                search ? 
                ilike(Users.name, `%${search}%`) : 
                sql`1=1`
            );

        const total = Number(countResult[0].count);

        // Get paginated results with search
        const users = await db
            .select()
            .from(Users)
            .where(
                search ? 
                ilike(Users.name, `%${search}%`) : 
                sql`1=1`
            )
            .limit(limit)
            .offset(offset);

        const response: BaseAPIResponse<typeof users> = {
            data: users,
            error: null,
            status: 200,
            total,
            page,
            per_page: limit
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: 'Failed to fetch users',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// POST new user
export async function POST(request: Request) {
    try {
        const body = await request.json() as CreateUser;
        
        // Hash the password
        const hashedPassword = await hash(body.password, 10);

        const user = await db.insert(Users)
            .values({
                name: body.name,
                email: body.email,
                phone: body.phone,
                slug: body.slug,
                password_hash: hashedPassword,
            })
            .returning();

        const response: BaseAPIResponse<typeof user[0]> = {
            data: user[0],
            error: null,
            status: 201,
            message: 'User created successfully'
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error(error);
        if (error instanceof Error && 'code' in error && error.code === '23505') {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: parseAlredyExist((error as unknown as Error & { detail: string }).detail),
                status: 400
            };
            return NextResponse.json(response, { status: 400 });
        }
        const response: BaseAPIResponse<null> = {
            data: null,
            error: 'Failed to create user',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
