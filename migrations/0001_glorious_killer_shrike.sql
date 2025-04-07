CREATE TABLE "budgets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category" text NOT NULL,
	"limit_amount" real NOT NULL,
	"current_spend" real DEFAULT 0 NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "investments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "recurring_payments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "investments" CASCADE;--> statement-breakpoint
DROP TABLE "recurring_payments" CASCADE;--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_provider_provider_account_id_unique";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "provider_account_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "token_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "scope" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "session_state" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "amount" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "lender" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "interest_rate" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "session_token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "amount" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "confirm_password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "verification_tokens" ALTER COLUMN "identifier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "verification_tokens" ALTER COLUMN "token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "amount" real NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "due_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "cycle" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "next_billing_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_category_month_year_idx" ON "budgets" USING btree ("user_id","category","month","year");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_provider_account_id_idx" ON "accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "product";--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "brand";--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "invoice_url";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN "initial_amount";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN "remaining_amount";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN "payment_amount";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN "payment_frequency";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "loans" DROP COLUMN "end_date";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "billing_cycle";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "next_payment_date";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "category";--> statement-breakpoint
DROP TYPE "public"."currency";