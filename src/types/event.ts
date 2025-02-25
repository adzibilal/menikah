export interface Event {
    event_id: string;
    user_id?: string; // Make user_id optional
    event_name: string;
    event_date: string;
    event_location: string;
    event_map_link?: string;
    event_description?: string;
}

// Type for form operations
export type EventFormData = Omit<Event, 'event_id' | 'user_id'>;
