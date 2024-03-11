DO $$ BEGIN
 CREATE TYPE "careerinterest_slug" AS ENUM('law', 'tech', 'consulting', 'banking_finance');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "groupuser_role" AS ENUM('ADMIN', 'EXPERT', 'MEMBER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_profiletype" AS ENUM('STUDENT', 'ADMIN', 'EXPERT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "careerInterest" ALTER COLUMN "slug" SET DATA TYPE careerinterest_slug;--> statement-breakpoint
ALTER TABLE "groupUser" ALTER COLUMN "role" SET DATA TYPE groupuser_role;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "profileType" SET DATA TYPE user_profiletype;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "isAnonymous" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "isAnonymous" boolean DEFAULT false NOT NULL;
