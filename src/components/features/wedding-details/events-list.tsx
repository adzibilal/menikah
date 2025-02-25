'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeddingDetails } from '@/store/use-wedding-details';
import {
    CalendarIcon,
    MapPinIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventFormPopup from './event-form-popup';
import { useToast } from '@/hooks/use-toast';
import { Event, EventFormData } from '@/types/event';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EventCardSkeleton } from '@/components/features/wedding-details/event-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventsList() {
    const session = useSession();
    const userId = session.data?.user.id;
    const { events, isLoading, error, fetchDetails } = useWeddingDetails();
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            fetchDetails(userId);
        }
    }, [userId, fetchDetails]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Wedding Events</CardTitle>
                    <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="grid gap-4">
                    {[...Array(3)].map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!events?.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Wedding Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        No events added yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const handleCreate = async (eventData: EventFormData) => {
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...eventData, 
                    user_id: userId 
                }),
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            toast({
                title: 'Success',
                description: 'Event created successfully',
            });

            setIsCreateOpen(false);
            fetchDetails(userId!);
        } catch (error) {
            toast({
                title: 'Error',
                description: (error as Error).message,
                variant: 'destructive',
            });
        }
    };

    const handleEdit = async (eventData: EventFormData) => {
        try {
            const response = await fetch(
                `/api/events/${selectedEvent?.event_id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventData),
                },
            );

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            toast({
                title: 'Success',
                description: 'Event updated successfully',
            });

            setIsEditOpen(false);
            setSelectedEvent(null);
            fetchDetails(userId!);
        } catch (error) {
            toast({
                title: 'Error',
                description: (error as Error).message,
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (eventId: string) => {
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            toast({
                title: 'Success',
                description: 'Event deleted successfully',
            });

            setEventToDelete(null); // Clear the eventToDelete state
            fetchDetails(userId!);
        } catch (error) {
            toast({
                title: 'Error',
                description: (error as Error).message,
                variant: 'destructive',
            });
        }
    };

    return (
        <>
            <Card suppressHydrationWarning>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Wedding Events</CardTitle>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Event
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {events.map((event) => (
                        <Card key={event.event_id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {event.event_name}
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                // Make sure we pass the complete event data
                                                const eventToEdit = {
                                                    ...event,
                                                    user_id: userId || undefined,
                                                    // Ensure date is in the correct format
                                                    event_date: new Date(event.event_date).toISOString()
                                                };
                                                setSelectedEvent(eventToEdit);
                                                setIsEditOpen(true);
                                            }}
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setEventToDelete(event.event_id)
                                            }
                                        >
                                            <TrashIcon className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>
                                            {new Date(
                                                event.event_date,
                                            ).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className="w-4 h-4" />
                                        <span>{event.event_location}</span>
                                    </div>
                                    {event.event_map_link && (
                                        <Link
                                            href={event.event_map_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline block mt-2"
                                        >
                                            View on Maps
                                        </Link>
                                    )}
                                    {event.event_description && (
                                        <p className="mt-2 text-sm">
                                            {event.event_description}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <EventFormPopup
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSubmit={handleCreate}
                title="Add New Event"
            />

            <EventFormPopup
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSubmit={handleEdit}
                title="Edit Event"
                defaultValues={selectedEvent}
            />

            <AlertDialog 
                open={!!eventToDelete} 
                onOpenChange={(open) => !open && setEventToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the event.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => eventToDelete && handleDelete(eventToDelete)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
