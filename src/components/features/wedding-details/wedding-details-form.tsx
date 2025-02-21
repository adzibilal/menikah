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

interface WeddingDetailsFormProps {
    initialData?: WeddingDetailsForm;
}

export default function WeddingDetailsForm({
    initialData,
}: WeddingDetailsFormProps) {
    const session = useSession();
    const userId = session.data?.user.id;
    const { toast } = useToast();
    const form = useForm<WeddingDetailsForm>({
        resolver: zodResolver(weddingDetailsSchema),
        defaultValues: initialData || {
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
        },
    });

    // Debounced update function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdate = useCallback(
        debounce((field: string, value: string) => {
            fetch(`/api/wedding-details/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.error) {
                        toast({
                            title: 'Success',
                            description: `Updated ${field.replace(/_/g, ' ')}`,
                            variant: 'default',
                        });
                    } else {
                        throw new Error(data.error);
                    }
                })
                .catch((error) => {
                    toast({
                        title: 'Error',
                        description: 'Failed to update: ' + error.message,
                        variant: 'destructive',
                    });
                    // Revert form value on error
                    form.setValue(
                        field as keyof WeddingDetailsForm,
                        initialData?.[field as keyof WeddingDetailsForm] || '',
                    );
                });
        }, 1000),
        [userId, toast, form, initialData],
    );

    // Watch for form changes
    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (name && type === 'change') {
                debouncedUpdate(
                    name,
                    value[name as keyof WeddingDetailsForm] as string,
                );
            }
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch, debouncedUpdate]);

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
