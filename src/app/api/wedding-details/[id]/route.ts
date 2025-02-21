import { NextResponse } from 'next/server';
import { db } from '@/db';
import { UserDetails, Events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { BaseAPIResponse } from '@/types/common';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        if (!userId) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User not found',
                status: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        // Get user details
        const userDetails = await db
            .select()
            .from(UserDetails)
            .where(eq(UserDetails.user_id, userId))
            .limit(1);

        // Get events
        const events = await db
            .select()
            .from(Events)
            .where(eq(Events.user_id, userId));

        const weddingDetails = {
            details: userDetails[0],
            events: events
        };

        const response: BaseAPIResponse<typeof weddingDetails> = {
            data: weddingDetails,
            error: null,
            status: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
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
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;
        const updates = await request.json();

        // Only update the fields that were provided
        const updatedDetails = await db
            .update(UserDetails)
            .set(updates)
            .where(eq(UserDetails.user_id, userId))
            .returning();

        const response: BaseAPIResponse<typeof updatedDetails[0]> = {
            data: updatedDetails[0],
            error: null,
            status: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: 'Failed to update wedding details',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
