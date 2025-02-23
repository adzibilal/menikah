import { create } from 'zustand';
import { BaseAPIResponse } from '@/types/common';

interface WeddingDetails {
    groom_name: string;
    bride_name: string;
    groom_photo: string;
    bride_photo: string;
    groom_dad_name: string;
    bride_dad_name: string;
    groom_mum_name: string;
    bride_mum_name: string;
    groom_instagram?: string;
    bride_instagram?: string;
}

interface WeddingDetailsState {
    details: WeddingDetails | null;
    isLoading: boolean;
    error: string | null;
    fetchDetails: (userId: string) => Promise<void>;
    updateDetail: (userId: string, field: string, value: string) => Promise<void>;
}

export const useWeddingDetails = create<WeddingDetailsState>((set) => ({
    details: null,
    isLoading: false,
    error: null,
    fetchDetails: async (userId: string) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`/api/wedding-details/${userId}`);
            const data: BaseAPIResponse<{ details: WeddingDetails }> = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            set({ details: data.data.details, error: null });
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },
    updateDetail: async (userId: string, field: string, value: string) => {
        try {
            const response = await fetch(`/api/wedding-details/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
            });
            const data: BaseAPIResponse<WeddingDetails> = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            set({ details: data.data, error: null });
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        }
    },
}));
