CREATE TABLE "user_details" (
	"user_detail_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"groom_name" varchar(100) NOT NULL,
	"bride_name" varchar(100) NOT NULL,
	"groom_photo" varchar(255) NOT NULL,
	"bride_photo" varchar(255) NOT NULL,
	"groom_dad_name" varchar(100) NOT NULL,
	"bride_dad_name" varchar(100) NOT NULL,
	"groom_mum_name" varchar(100) NOT NULL,
	"bride_mum_name" varchar(100) NOT NULL,
	"groom_instagram" varchar(100),
	"bride_instagram" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "name" varchar(100);--> statement-breakpoint
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "groom_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "bride_name";