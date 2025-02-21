ALTER TABLE "events" ALTER COLUMN "event_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "photo_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "photo_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "guest_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "guest_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "num_attendees" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "message_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "message_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "guest_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "setting_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "setting_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_id" SET DEFAULT gen_random_uuid();