import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { UpdateUser } from '@/types/user';
import { BaseAPIResponse } from '@/types/common';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await db.select()
            .from(Users)
            .where(eq(Users.user_id, params.id));

        if (!user.length) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User not found',
                status: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        const response: BaseAPIResponse<typeof user[0]> = {
            data: user[0],
            error: null,
            status: 200
        };
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: 'Failed to fetch user',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json() as UpdateUser;
        const updateData: Partial<typeof Users.$inferInsert> = {};

        // Only include defined fields
        if (body.name) updateData.name = body.name;
        if (body.email) updateData.email = body.email;
        if (body.phone) updateData.phone = body.phone;
        if (body.slug) updateData.slug = body.slug;
        if (body.password) {
            updateData.password_hash = await hash(body.password, 10);
        }

        const updatedUser = await db.update(Users)
            .set(updateData)
            .where(eq(Users.user_id, params.id))
            .returning();

        if (!updatedUser.length) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User not found',
                status: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        const response: BaseAPIResponse<typeof updatedUser[0]> = {
            data: updatedUser[0],
            error: null,
            status: 200,
            message: 'User updated successfully'
        };
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: 'Failed to update user',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const deletedUser = await db.delete(Users)
            .where(eq(Users.user_id, params.id))
            .returning();

        if (!deletedUser.length) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User not found',
                status: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        const response: BaseAPIResponse<null> = {
            data: null,
            error: null,
            status: 200,
            message: 'User deleted successfully'
        };
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: 'Failed to delete user',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
