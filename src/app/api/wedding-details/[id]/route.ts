import { NextResponse } from 'next/server';
import { db } from '@/db';
import { UserDetails, Events, Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { BaseAPIResponse } from '@/types/common';

export async function GET(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(context.params);

        if (!id) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User ID is required',
                status: 400
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Get user details
        const userDetails = await db
            .select()
            .from(UserDetails)
            .where(eq(UserDetails.user_id, id))
            .limit(1);

        // Get events
        const events = await db
            .select()
            .from(Events)
            .where(eq(Events.user_id, id));

        const weddingDetails = {
            details: userDetails[0] || null,
            events: events
        };

        const response: BaseAPIResponse<typeof weddingDetails> = {
            data: weddingDetails,
            error: null,
            status: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('GET error:', error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: 'Failed to fetch wedding details',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(context.params);
        
        if (!id) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User ID is required',
                status: 400
            };
            return NextResponse.json(response, { status: 400 });
        }

        console.log('id:', id);
        // Check if user exists first
        const user = await db
            .select()
            .from(Users)
            .where(eq(Users.user_id, id))
            .limit(1);

        if (!user.length) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User not found',
                status: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        const updates = await request.json();

        // First check if user details record exists
        const existingRecord = await db
            .select()
            .from(UserDetails)
            .where(eq(UserDetails.user_id, id))
            .limit(1);

        let result;

        if (existingRecord.length === 0) {
            // Create user details record
            result = await db
                .insert(UserDetails)
                .values({
                    user_id: id,
                    ...updates,
                })
                .returning();
        } else {
            // Update existing record
            result = await db
                .update(UserDetails)
                .set(updates)
                .where(eq(UserDetails.user_id, id))
                .returning();
        }

        const response: BaseAPIResponse<typeof result[0]> = {
            data: result[0],
            error: null,
            status: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('PATCH error:', error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to update wedding details',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
