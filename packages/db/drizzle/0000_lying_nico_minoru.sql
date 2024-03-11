DO $$ BEGIN
 CREATE TYPE "careerInterest_slug" AS ENUM('law', 'tech', 'consulting', 'banking_finance');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "groupUser_role" AS ENUM('ADMIN', 'EXPERT', 'MEMBER');
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
 CREATE TYPE "user_ethnicity" AS ENUM('english__welsh__scottish__northern_irish_or_british', 'irish', 'gypsy_or_irish_traveller', 'roma', 'any_other_white_background', 'caribbean', 'african', 'any_other_black__black_british__or_caribbean_background', 'indian', 'pakistani', 'bangladeshi', 'chinese', 'any_other_asian_background', 'white_and_black_caribbean', 'white_and_black_african', 'white_and_asian', 'any_other_mixed_or_multiple_ethnic_background', 'arab', 'any_other_ethnic_group');
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
 CREATE TYPE "user_profileType" AS ENUM('STUDENT', 'ADMIN', 'EXPERT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "careerInterest" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" "careerInterest_slug" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "careerInterestToUser" (
	"careerInterestId" integer NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "careerInterestUserId" PRIMARY KEY("careerInterestId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"commentId" varchar(191) NOT NULL,
	"content" varchar(191) NOT NULL,
	"authorId" varchar(191) NOT NULL,
	"threadId" varchar(191) NOT NULL,
	"groupId" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"groupId" varchar(191) NOT NULL,
	"slug" varchar(191) NOT NULL,
	"name" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groupUser" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(191) NOT NULL,
	"groupId" varchar(191) NOT NULL,
	"role" "groupUser_role" DEFAULT 'MEMBER' NOT NULL,
	"firstname" varchar(191),
	"imageUrl" varchar(191),
	"lastname" varchar(191)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" varchar(191) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"messageId" varchar(191) NOT NULL,
	"authorId" varchar(191) NOT NULL,
	"groupId" varchar(191) NOT NULL,
	"threadId" varchar(191),
	"type" "message_type" DEFAULT 'NORMAL' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"reactionId" varchar(191) NOT NULL,
	"authorId" varchar(191) NOT NULL,
	"messageId" integer,
	"commentId" integer,
	"emoji" varchar(191) NOT NULL,
	"code" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thread" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"threadId" varchar(191) NOT NULL,
	"content" varchar(191) NOT NULL,
	"authorId" varchar(191) NOT NULL,
	"messageId" integer NOT NULL,
	"groupId" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"clerkId" varchar(191) NOT NULL,
	"email" varchar(191) NOT NULL,
	"firstname" varchar(191) NOT NULL,
	"lastname" varchar(191) NOT NULL,
	"gender" "user_gender" DEFAULT 'female' NOT NULL,
	"completionYear" integer NOT NULL,
	"broadDegreeCourse" varchar(191) NOT NULL,
	"university" varchar(191) NOT NULL,
	"degreeName" varchar(191) NOT NULL,
	"imageKey" varchar(191),
	"imageUrl" varchar(191),
	"clerkImageHash" varchar(191),
	"profileType" "user_profileType" DEFAULT 'STUDENT' NOT NULL,
	"ethnicity" "user_ethnicity" DEFAULT 'african' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49236_careerInterest_slug_key" ON "careerInterest" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49241_comment_authorId_threadId_groupId_idx" ON "comment" ("authorId","threadId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49241_comment_commentId_key" ON "comment" ("commentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_groupId_key" ON "group" ("groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_slug_key" ON "group" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "groupUser_userId_groupId_idx" ON "groupUser" ("userId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49267_message_messageId_key" ON "message" ("messageId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49267_message_authorId_groupId_idx" ON "message" ("authorId","groupId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49277_reaction_authorId_messageId_commentId_idx" ON "reaction" ("authorId","messageId","commentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49277_reaction_reactionId_key" ON "reaction" ("reactionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49286_thread_authorId_messageId_groupId_idx" ON "thread" ("authorId","messageId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_threadId_key" ON "thread" ("threadId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_messageId_key" ON "thread" ("messageId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "clerkIdIdx" ON "user" ("clerkId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailIdx" ON "user" ("email");