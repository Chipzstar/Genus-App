DO $$ BEGIN
 CREATE TYPE "user_currentyear" AS ENUM('1st_year', '2nd_year', '3rd_year', '4th_year', 'graduate', 'postgraduate', 'phd', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_onboardingstatus" AS ENUM('not_started', 'background_info', 'career_info', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "user_profiletype" ADD VALUE 'student';--> statement-breakpoint
ALTER TYPE "user_profiletype" ADD VALUE 'graduate';--> statement-breakpoint
ALTER TYPE "user_profiletype" ADD VALUE 'admin';--> statement-breakpoint
ALTER TYPE "user_profiletype" ADD VALUE 'expert';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"companyId" varchar(191) NOT NULL,
	"name" varchar(191) NOT NULL,
	"slug" varchar(191) NOT NULL,
	"category" "careerinterest_slug" DEFAULT 'banking_finance' NOT NULL,
	"description" varchar(191),
	"logoUrl" varchar(191),
	"websiteUrl" varchar(191),
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "currentYear" SET DATA TYPE user_currentyear;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "currentYear" SET DEFAULT '1st_year';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "profileType" SET DEFAULT 'student';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboardingStatus" "user_onboardingstatus" DEFAULT 'background_info' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isActive" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isDeleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "companyIdIdx" ON "company" ("companyId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slugIdx" ON "company" ("slug");