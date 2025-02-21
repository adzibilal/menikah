CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'sent', 'opened');--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"event_name" varchar(100) NOT NULL,
	"event_date" timestamp NOT NULL,
	"event_location" varchar(255) NOT NULL,
	"event_map_link" varchar(255),
	"event_description" text
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"photo_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"photo_url" varchar(255) NOT NULL,
	"caption" varchar(255),
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"guest_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"guest_name" varchar(100) NOT NULL,
	"guest_email" varchar(100),
	"guest_phone" varchar(20),
	"is_attending" boolean NOT NULL,
	"num_attendees" serial NOT NULL,
	"notes" text,
	"invitation_status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"whatsapp_link_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"message_id" serial PRIMARY KEY NOT NULL,
	"guest_id" serial NOT NULL,
	"message_text" text NOT NULL,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"bank_name" varchar(100) NOT NULL,
	"account_number" varchar(50) NOT NULL,
	"account_name" varchar(100) NOT NULL,
	"ewallet_name" varchar(100),
	"ewallet_number" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"setting_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"theme" varchar(50) NOT NULL,
	"music_url" varchar(255),
	"password" varchar(255),
	"is_live_stream" boolean DEFAULT false,
	"live_stream_link" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"groom_name" varchar(100) NOT NULL,
	"bride_name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_guest_id_guests_guest_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("guest_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;