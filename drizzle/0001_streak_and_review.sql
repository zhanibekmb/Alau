CREATE TABLE "reading_days" (
	"user_id" text NOT NULL,
	"day" date NOT NULL,
	CONSTRAINT "reading_days_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
ALTER TABLE "saved_words" ADD COLUMN "review_box" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_words" ADD COLUMN "review_due" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "saved_words" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reading_days" ADD CONSTRAINT "reading_days_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;