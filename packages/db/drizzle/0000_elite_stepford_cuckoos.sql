-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
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
 CREATE TYPE "message_type" AS ENUM('NORMAL', 'EVENT', 'ANNOUNCEMENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_gender" AS ENUM('male', 'female', 'non_binary', 'other');
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
DO $$ BEGIN
 CREATE TYPE "user_ethnicity" AS ENUM('english__welsh__scottish__northern_irish_or_british', 'irish', 'gypsy_or_irish_traveller', 'roma', 'any_other_white_background', 'caribbean', 'african', 'any_other_black__black_british__or_caribbean_background', 'indian', 'pakistani', 'bangladeshi', 'chinese', 'any_other_asian_background', 'white_and_black_caribbean', 'white_and_black_african', 'white_and_asian', 'any_other_mixed_or_multiple_ethnic_background', 'arab', 'any_other_ethnic_group');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "careerinterest" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" "careerinterest_slug" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"commentid" varchar(191) NOT NULL,
	"content" varchar(191) NOT NULL,
	"authorid" varchar(191) NOT NULL,
	"threadid" varchar(191) NOT NULL,
	"groupid" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"groupid" varchar(191) NOT NULL,
	"slug" varchar(191) NOT NULL,
	"name" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groupuser" (
	"id" serial PRIMARY KEY NOT NULL,
	"userid" varchar(191) NOT NULL,
	"groupid" varchar(191) NOT NULL,
	"role" "groupuser_role" DEFAULT 'MEMBER' NOT NULL,
	"firstname" varchar(191),
	"imageurl" varchar(191),
	"lastname" varchar(191)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" varchar(191) NOT NULL,
	"createdat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"messageid" varchar(191) NOT NULL,
	"authorid" varchar(191) NOT NULL,
	"groupid" varchar(191) NOT NULL,
	"type" "message_type" DEFAULT 'NORMAL' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"reactionid" varchar(191) NOT NULL,
	"authorid" varchar(191) NOT NULL,
	"messageid" integer,
	"commentid" integer,
	"emoji" varchar(191) NOT NULL,
	"code" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thread" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"threadid" varchar(191) NOT NULL,
	"content" varchar(191) NOT NULL,
	"authorid" varchar(191) NOT NULL,
	"messageid" integer NOT NULL,
	"groupid" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedat" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"clerkid" varchar(191) NOT NULL,
	"email" varchar(191) NOT NULL,
	"firstname" varchar(191) NOT NULL,
	"lastname" varchar(191) NOT NULL,
	"gender" "user_gender" DEFAULT 'female' NOT NULL,
	"completionyear" integer NOT NULL,
	"broaddegreecourse" varchar(191) NOT NULL,
	"university" varchar(191) NOT NULL,
	"degreename" varchar(191) NOT NULL,
	"imagekey" varchar(191),
	"imageurl" varchar(191),
	"clerkimagehash" varchar(191),
	"profiletype" "user_profiletype" DEFAULT 'STUDENT' NOT NULL,
	"ethnicity" "user_ethnicity" DEFAULT 'african' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_careerinteresttouser" (
	"a" integer NOT NULL,
	"b" integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49236_careerinterest_slug_key" ON "careerinterest" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49241_comment_authorid_threadid_groupid_idx" ON "comment" ("authorid","threadid","groupid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49241_comment_commentid_key" ON "comment" ("commentid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_groupid_key" ON "group" ("groupid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_slug_key" ON "group" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49259_groupuser_userid_groupid_idx" ON "groupuser" ("userid","groupid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49267_message_messageid_key" ON "message" ("messageid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49267_message_authorid_groupid_idx" ON "message" ("authorid","groupid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49277_reaction_authorid_messageid_commentid_idx" ON "reaction" ("authorid","messageid","commentid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49277_reaction_reactionid_key" ON "reaction" ("reactionid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49286_thread_authorid_messageid_groupid_idx" ON "thread" ("authorid","messageid","groupid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_threadid_key" ON "thread" ("threadid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_messageid_key" ON "thread" ("messageid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49295_user_clerkid_key" ON "user" ("clerkid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49295_user_email_key" ON "user" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49306__careerinteresttouser_b_index" ON "_careerinteresttouser" ("b");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49306__careerinteresttouser_ab_unique" ON "_careerinteresttouser" ("a","b");
*/