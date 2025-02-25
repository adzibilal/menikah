'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Event, EventFormData } from '@/types/event';

const eventSchema = z.object({
    event_name: z.string().min(1, 'Event name is required'),
    event_date: z.string().min(1, 'Event date is required'),
    event_location: z.string().min(1, 'Event location is required'),
    event_map_link: z.string().optional(),
    event_description: z.string().optional(),
});

interface EventFormPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: EventFormData) => Promise<void>;
    title: string;
    defaultValues?: Event | null;
}

export default function EventFormPopup({
    open,
    onOpenChange,
    onSubmit,
    title,
    defaultValues,
}: EventFormPopupProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        values: {  // Change defaultValues to values for immediate update
            event_name: defaultValues?.event_name ?? '',
            event_date: defaultValues?.event_date 
                ? new Date(defaultValues.event_date).toISOString().slice(0, 16)
                : '',
            event_location: defaultValues?.event_location ?? '',
            event_map_link: defaultValues?.event_map_link ?? '',
            event_description: defaultValues?.event_description ?? '',
        },
    });

    // Reset form when modal opens/closes or defaultValues change
    useEffect(() => {
        if (open) {
            form.reset({
                event_name: defaultValues?.event_name ?? '',
                event_date: defaultValues?.event_date 
                    ? new Date(defaultValues.event_date).toISOString().slice(0, 16)
                    : '',
                event_location: defaultValues?.event_location ?? '',
                event_map_link: defaultValues?.event_map_link ?? '',
                event_description: defaultValues?.event_description ?? '',
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = async (values: z.infer<typeof eventSchema>) => {
        setIsSubmitting(true);
        try {
            await onSubmit(values);
            form.reset();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="event_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter event name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="event_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Date</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="event_location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter event location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="event_map_link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Map Link (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Google Maps link" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="event_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Enter event description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
