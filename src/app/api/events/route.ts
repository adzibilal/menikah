import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Events, Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { BaseAPIResponse } from '@/types/common';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user_id, event_name, event_date, event_location, event_map_link, event_description } = body;

        if (!user_id) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User ID is required',
                status: 400
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Check if user exists
        const user = await db
            .select()
            .from(Users)
            .where(eq(Users.user_id, user_id))
            .limit(1);

        if (!user.length) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'User not found',
                status: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        // Insert new event
        const result = await db
            .insert(Events)
            .values({
                user_id,
                event_name,
                event_date: new Date(event_date),
                event_location,
                event_map_link,
                event_description,
            })
            .returning();

        const response: BaseAPIResponse<typeof result[0]> = {
            data: result[0],
            error: null,
            status: 201
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('POST error:', error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to create event',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
