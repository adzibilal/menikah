import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { BaseAPIResponse } from '@/types/common';

export async function PUT(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params;
        const body = await request.json();
        const { event_name, event_date, event_location, event_map_link, event_description } = body;

        // Check if event exists
        const existingEvent = await db
            .select()
            .from(Events)
            .where(eq(Events.event_id, id))
            .limit(1);

        if (!existingEvent.length) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'Event not found',
                status: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        // Update event
        const result = await db
            .update(Events)
            .set({
                event_name,
                event_date: new Date(event_date),
                event_location,
                event_map_link,
                event_description,
            })
            .where(eq(Events.event_id, id))
            .returning();

        const response: BaseAPIResponse<typeof result[0]> = {
            data: result[0],
            error: null,
            status: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('PUT error:', error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to update event',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params;

        // Check if event exists
        const existingEvent = await db
            .select()
            .from(Events)
            .where(eq(Events.event_id, id))
            .limit(1);

        if (!existingEvent.length) {
            const response: BaseAPIResponse<null> = {
                data: null,
                error: 'Event not found',
                status: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        // Delete event
        const result = await db
            .delete(Events)
            .where(eq(Events.event_id, id))
            .returning();

        const response: BaseAPIResponse<typeof result[0]> = {
            data: result[0],
            error: null,
            status: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('DELETE error:', error);
        const response: BaseAPIResponse<null> = {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to delete event',
            status: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
