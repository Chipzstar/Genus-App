DO $$ BEGIN
 CREATE TYPE "public"."careerinterest_slug" AS ENUM('banking_finance', 'law', 'consulting', 'tech');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."review_industry" AS ENUM('banking_finance', 'law', 'consulting', 'tech', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."groupuser_role" AS ENUM('ADMIN', 'EXPERT', 'MEMBER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."message_type" AS ENUM('NORMAL', 'EVENT', 'ANNOUNCEMENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."skillset_slug" AS ENUM('written_communication', 'verbal_communication', 'interpersonal_skills', 'time_management', 'emotional_intelligence', 'critical_thinking', 'sales', 'leadership_&_management', 'negotiation', 'creativity', 'teamwork', 'financial_literacy', 'analytical_skills', 'problem_solving', 'project_management', 'adaptability', 'delegation', 'data_analysis', 'technical_&_coding_skills', 'research', 'public_speaking_&_presentation', 'social_media_&_content_creation', 'digital_skills', 'marketing', 'strategy', 'organisation', 'attention_to_detail', 'conflict_resolution', 'artistic_skills', 'modelling', 'commercial_awareness', 'enterprise_and_entrepreneurial_skills', 'customer_service', 'design', 'videography_&_photography');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_currentyear" AS ENUM('1st_year', '2nd_year', '3rd_year', '4th_year', 'graduate', 'postgraduate', 'phd', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_ethnicity" AS ENUM('english__welsh__scottish__northern_irish_or_british', 'irish', 'gypsy_or_irish_traveller', 'roma', 'any_other_white_background', 'caribbean', 'african', 'any_other_black__black_british__or_caribbean_background', 'indian', 'pakistani', 'bangladeshi', 'chinese', 'any_other_asian_background', 'white_and_black_caribbean', 'white_and_black_african', 'white_and_asian', 'any_other_mixed_or_multiple_ethnic_background', 'arab', 'any_other_ethnic_group');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_gender" AS ENUM('male', 'female', 'non_binary', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_onboardingstatus" AS ENUM('not_started', 'background_info', 'career_info', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_profiletype" AS ENUM('student', 'graduate', 'admin', 'expert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "careerInterest" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" "careerinterest_slug" NOT NULL
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
	"groupId" varchar(191) NOT NULL,
	"isAnonymous" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"companyId" varchar(191) NOT NULL,
	"name" varchar(191) NOT NULL,
	"slug" varchar(191) NOT NULL,
	"category" "review_industry" NOT NULL,
	"description" varchar(191),
	"logoUrl" varchar(191),
	"websiteUrl" varchar(191),
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companyToUser" (
	"companyId" integer NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "companyUserId" PRIMARY KEY("companyId","userId")
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
	"role" "groupuser_role" DEFAULT 'MEMBER' NOT NULL,
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
	"type" "message_type" DEFAULT 'NORMAL' NOT NULL,
	"isAnonymous" boolean DEFAULT false NOT NULL
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
CREATE TABLE IF NOT EXISTS "referral" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"submissionId" varchar(191) NOT NULL,
	"referralId" varchar(191) NOT NULL,
	"referrerName" varchar(191) NOT NULL,
	"referrerEmail" varchar(191) NOT NULL,
	"refereeEmail1" varchar(191) NOT NULL,
	"refereeEmail2" varchar(191),
	"refereeEmail3" varchar(191),
	"isActive" boolean DEFAULT true NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewId" varchar(191) NOT NULL,
	"companyId" varchar(191) NOT NULL,
	"companyName" varchar(191) NOT NULL,
	"industry" "review_industry" NOT NULL,
	"experienceType" varchar(191),
	"applicationProcess" numeric NOT NULL,
	"interviewProcess" numeric NOT NULL,
	"diversity" numeric NOT NULL,
	"flexibility" numeric NOT NULL,
	"teamCulture" numeric NOT NULL,
	"workLifeBalance" numeric NOT NULL,
	"authenticity" numeric NOT NULL,
	"recommendToFriend" numeric NOT NULL,
	"avgRating" numeric NOT NULL,
	"isConverter" boolean DEFAULT false NOT NULL,
	"completionYear" integer,
	"division" varchar(191),
	"region" varchar(191) NOT NULL,
	"topTip" varchar(191) DEFAULT '' NOT NULL,
	"topSkills" text[] DEFAULT '{}'::text[] NOT NULL,
	"pros" text[] DEFAULT '{}'::text[] NOT NULL,
	"cons" text[] DEFAULT '{}'::text[] NOT NULL,
	"interviewQuestions" text[] DEFAULT '{}'::text[] NOT NULL,
	"topResources" text[] DEFAULT '{}'::text[] NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skillset" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"slug" "skillset_slug" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skillsetToUser" (
	"skillsetId" integer NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "skillsetUserId" PRIMARY KEY("skillsetId","userId")
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
CREATE TABLE IF NOT EXISTS "typeformWebhook" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"eventId" varchar(191) NOT NULL,
	"eventType" varchar(191) NOT NULL,
	"typeformId" varchar(191) NOT NULL,
	"title" varchar(191) NOT NULL,
	"num_questions" integer NOT NULL,
	"num_answers" integer NOT NULL,
	"url" varchar(191),
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"clerkId" varchar(191) NOT NULL,
	"email" varchar(191) NOT NULL,
	"username" varchar(191) DEFAULT '' NOT NULL,
	"firstname" varchar(191) NOT NULL,
	"lastname" varchar(191) NOT NULL,
	"gender" "user_gender" DEFAULT 'female',
	"ethnicity" "user_ethnicity" DEFAULT 'african',
	"university" varchar(191),
	"broadDegreeCourse" varchar(191),
	"degreeName" varchar(191),
	"currentYear" "user_currentyear",
	"completionYear" integer,
	"experienceType" varchar(191),
	"workPreference" varchar(191),
	"imageKey" varchar(191),
	"imageUrl" varchar(191),
	"clerkImageHash" varchar(191),
	"profileType" "user_profiletype" DEFAULT 'student' NOT NULL,
	"onboardingStatus" "user_onboardingstatus" DEFAULT 'background_info' NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"tempPassword" varchar(191) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49236_careerInterest_slug_key" ON "careerInterest" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49241_comment_authorId_threadId_groupId_idx" ON "comment" ("authorId","threadId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49241_comment_commentId_key" ON "comment" ("commentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "companyIdIdx" ON "company" ("companyId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "companySlugIdx" ON "company" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_groupId_key" ON "group" ("groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_slug_key" ON "group" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "groupUser_userId_groupId_idx" ON "groupUser" ("userId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49267_message_messageId_key" ON "message" ("messageId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49267_message_authorId_groupId_idx" ON "message" ("authorId","groupId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49277_reaction_authorId_messageId_commentId_idx" ON "reaction" ("authorId","messageId","commentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49277_reaction_reactionId_key" ON "reaction" ("reactionId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "referralIdIdx" ON "referral" ("referralId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reviewIdIdx" ON "review" ("reviewId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49237_skillset_slug_key" ON "skillset" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49286_thread_authorId_messageId_groupId_idx" ON "thread" ("authorId","messageId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_threadId_key" ON "thread" ("threadId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_messageId_key" ON "thread" ("messageId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "typeFormWebhookEventIdIdx" ON "typeformWebhook" ("eventId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "clerkIdUserIdx" ON "user" ("clerkId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "userEmailUserIdx" ON "user" ("email");
