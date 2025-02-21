import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
    text,
    pgEnum,
} from 'drizzle-orm/pg-core';

// Define the enum type first
export const invitationStatusEnum = pgEnum('invitation_status', [
    'pending',
    'sent',
    'opened',
]);

export const Users = pgTable('users', {
    user_id: uuid('user_id').defaultRandom().primaryKey(),
    groom_name: varchar('groom_name', { length: 100 }).notNull(),
    bride_name: varchar('bride_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
});

export const Events = pgTable('events', {
    event_id: uuid('event_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => Users.user_id),
    event_name: varchar('event_name', { length: 100 }).notNull(),
    event_date: timestamp('event_date').notNull(),
    event_location: varchar('event_location', { length: 255 }).notNull(),
    event_map_link: varchar('event_map_link', { length: 255 }),
    event_description: text('event_description'),
});

export const Guests = pgTable('guests', {
    guest_id: uuid('guest_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => Users.user_id),
    guest_name: varchar('guest_name', { length: 100 }).notNull(),
    guest_email: varchar('guest_email', { length: 100 }),
    guest_phone: varchar('guest_phone', { length: 20 }),
    is_attending: boolean('is_attending').notNull(),
    num_attendees: uuid('num_attendees').notNull(),
    notes: text('notes'),
    invitation_status: invitationStatusEnum('invitation_status')
        .notNull()
        .default('pending'),
    whatsapp_link_sent: boolean('whatsapp_link_sent').default(false),
    created_at: timestamp('created_at').defaultNow(),
});

export const Gallery = pgTable('gallery', {
    photo_id: uuid('photo_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => Users.user_id),
    photo_url: varchar('photo_url', { length: 255 }).notNull(),
    caption: varchar('caption', { length: 255 }),
    uploaded_at: timestamp('uploaded_at').defaultNow(),
});

export const Messages = pgTable('messages', {
    message_id: uuid('message_id').defaultRandom().primaryKey(),
    guest_id: uuid('guest_id')
        .notNull()
        .references(() => Guests.guest_id),
    message_text: text('message_text').notNull(),
    sent_at: timestamp('sent_at').defaultNow(),
});

export const Payments = pgTable('payments', {
    payment_id: uuid('payment_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => Users.user_id),
    bank_name: varchar('bank_name', { length: 100 }).notNull(),
    account_number: varchar('account_number', { length: 50 }).notNull(),
    account_name: varchar('account_name', { length: 100 }).notNull(),
    ewallet_name: varchar('ewallet_name', { length: 100 }),
    ewallet_number: varchar('ewallet_number', { length: 50 }),
});

export const Settings = pgTable('settings', {
    setting_id: uuid('setting_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => Users.user_id),
    theme: varchar('theme', { length: 50 }).notNull(),
    music_url: varchar('music_url', { length: 255 }),
    password: varchar('password', { length: 255 }),
    is_live_stream: boolean('is_live_stream').default(false),
    live_stream_link: varchar('live_stream_link', { length: 255 }),
});

export const Admins = pgTable('admins', {
    id: uuid('admin_id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
});
