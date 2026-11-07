CREATE TYPE "public"."entitlement_kind" AS ENUM('single_book', 'premium_monthly', 'premium_annual');--> statement-breakpoint
CREATE TYPE "public"."entitlement_source" AS ENUM('demo');--> statement-breakpoint
CREATE TYPE "public"."paywall_event_type" AS ENUM('paywall_shown', 'plan_chosen', 'signup', 'demo_unlock');--> statement-breakpoint
CREATE TABLE "entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"kind" "entitlement_kind" NOT NULL,
	"work" text,
	"source" "entitlement_source" NOT NULL,
	"starts_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entitlements_kind_shape" CHECK (("entitlements"."kind" = 'single_book' AND "entitlements"."work" IS NOT NULL AND "entitlements"."expires_at" IS NULL)
        OR ("entitlements"."kind" <> 'single_book' AND "entitlements"."work" IS NULL AND "entitlements"."expires_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "paywall_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"anon_id" text,
	"type" "paywall_event_type" NOT NULL,
	"plan" "entitlement_kind",
	"work" text,
	"slug" text,
	"chapter" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_progress" (
	"user_id" text NOT NULL,
	"slug" text NOT NULL,
	"page" integer NOT NULL,
	"total_pages" integer NOT NULL,
	"finished" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "reading_progress_user_id_slug_pk" PRIMARY KEY("user_id","slug")
);
--> statement-breakpoint
CREATE TABLE "saved_words" (
	"user_id" text NOT NULL,
	"gloss_id" text NOT NULL,
	"lemma" text NOT NULL,
	"kk" text NOT NULL,
	"ipa" text NOT NULL,
	"pos" text NOT NULL,
	"slug" text NOT NULL,
	"book_title" text NOT NULL,
	"page" integer NOT NULL,
	"sentence" text NOT NULL,
	"saved_at" timestamp with time zone NOT NULL,
	CONSTRAINT "saved_words_user_id_gloss_id_pk" PRIMARY KEY("user_id","gloss_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paywall_events" ADD CONSTRAINT "paywall_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_words" ADD CONSTRAINT "saved_words_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entitlements_user_idx" ON "entitlements" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "entitlements_one_book_per_user" ON "entitlements" USING btree ("user_id","work") WHERE "entitlements"."kind" = 'single_book';--> statement-breakpoint
CREATE INDEX "paywall_events_type_time_idx" ON "paywall_events" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "paywall_events_anon_idx" ON "paywall_events" USING btree ("anon_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");