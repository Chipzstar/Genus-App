ALTER TYPE "user_profiletype" ADD VALUE 'GRADUATE';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "currentYear" varchar(191) DEFAULT '1st year';