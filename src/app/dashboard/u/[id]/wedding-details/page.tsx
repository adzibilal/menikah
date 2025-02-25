'use client';
import EventsList from '@/components/features/wedding-details/events-list';
import WeddingDetailsForm from '@/components/features/wedding-details/wedding-details-form';
import { useWeddingDetails } from '@/store/use-wedding-details';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const WeddingDetailsPage = () => {
    const session = useSession();
    const userId = session.data?.user.id;
    // Add this to handle initial mounting state
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { fetchDetails } = useWeddingDetails();
    // Fetch initial data
    useEffect(() => {
        if (isMounted && userId) {
            fetchDetails(userId);
        }
    }, [userId, fetchDetails, isMounted]);

    return (
        <div className='space-y-6' suppressHydrationWarning>
            <WeddingDetailsForm />
            <EventsList />
        </div>
    );
};

export default WeddingDetailsPage;
