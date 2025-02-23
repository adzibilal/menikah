'use client';

import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { debounce } from 'lodash';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useWeddingDetails } from '@/store/use-wedding-details';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const weddingDetailsSchema = z.object({
    groom_name: z.string().min(1, 'Groom name is required'),
    bride_name: z.string().min(1, 'Bride name is required'),
    groom_photo: z.string().min(1, 'Groom photo URL is required'),
    bride_photo: z.string().min(1, 'Bride photo URL is required'),
    groom_dad_name: z.string().min(1, "Groom's father name is required"),
    bride_dad_name: z.string().min(1, "Bride's father name is required"),
    groom_mum_name: z.string().min(1, "Groom's mother name is required"),
    bride_mum_name: z.string().min(1, "Bride's mother name is required"),
    groom_instagram: z.string().optional(),
    bride_instagram: z.string().optional(),
});

type WeddingDetailsForm = z.infer<typeof weddingDetailsSchema>;

const defaultFormValues: WeddingDetailsForm = {
    groom_name: '',
    bride_name: '',
    groom_photo: '',
    bride_photo: '',
    groom_dad_name: '',
    bride_dad_name: '',
    groom_mum_name: '',
    bride_mum_name: '',
    groom_instagram: '',
    bride_instagram: '',
};

export default function WeddingDetailsForm() {
    const session = useSession();
    const userId = session.data?.user.id;
    const { toast } = useToast();
    const { details, isLoading, error, fetchDetails, updateDetail } = useWeddingDetails();

    const form = useForm<WeddingDetailsForm>({
        resolver: zodResolver(weddingDetailsSchema),
        defaultValues: defaultFormValues,
    });

    // Fetch initial data
    useEffect(() => {
        if (userId) {
            fetchDetails(userId);
        }
    }, [userId, fetchDetails]);

    // Update form when details change
    useEffect(() => {
        if (details) {
            Object.keys(defaultFormValues).forEach((key) => {
                const value = details[key as keyof WeddingDetailsForm];
                form.setValue(
                    key as keyof WeddingDetailsForm, 
                    value || '' // Ensure we always set a string value
                );
            });
        }
    }, [details, form]);

    // Debounced update function
    const debouncedUpdate = useCallback(
        debounce(async (field: string, value: string) => {
            if (!userId || value === undefined) return;

            try {
                await updateDetail(userId, field, value);
                toast({
                    title: 'Success',
                    description: `Updated ${field.replace(/_/g, ' ')}`,
                    variant: 'default',
                });
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to update: ' + (error as Error).message,
                    variant: 'destructive',
                });
            }
        }, 1000),
        [userId, updateDetail, toast]
    );

    // Watch for form changes
    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (name && type === 'change' && value[name] !== undefined) {
                debouncedUpdate(name, value[name as keyof WeddingDetailsForm] as string);
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch, debouncedUpdate]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle>Wedding Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Bride and Groom Section */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="groom_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Groom Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter groom name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="groom_photo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Groom Photo URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter groom photo URL"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="bride_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bride Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter bride name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bride_photo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bride Photo URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter bride photo URL"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Parents Section */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="groom_dad_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Groom&apos;s Father Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter groom's father name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="groom_mum_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Groom&apos;s Mother Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter groom's mother name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="bride_dad_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Bride&apos;s Father Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter bride's father name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bride_mum_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Bride&apos;s Mother Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter bride's mother name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Social Media Section */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="groom_instagram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Groom&apos;s Instagram
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter groom's Instagram"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="bride_instagram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Bride&apos;s Instagram
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter bride's Instagram"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </Form>
            </CardContent>
        </Card>
    );
}
