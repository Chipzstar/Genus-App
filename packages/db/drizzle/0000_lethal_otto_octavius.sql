DO $$ BEGIN
 CREATE TYPE "public"."business_role" AS ENUM('ADMIN', 'MEMBER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."company_industry" AS ENUM('other', 'law', 'tech', 'consulting', 'banking_finance');
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
 CREATE TYPE "public"."hobbies_interests" AS ENUM('reading', 'writing', 'music', 'art', 'socialising', 'sports', 'cooking', 'dancing', 'property', 'traveling', 'photography', 'gaming', 'hiking', 'other');
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
 CREATE TYPE "public"."role_sector" AS ENUM('accounting', 'aerospace', 'agriculture', 'arts_fashion_creatives', 'business_management', 'charities_voluntary_sector', 'commerce', 'construction', 'consulting_professional_services', 'design', 'distribution', 'economics', 'education_teaching', 'electronics', 'energy_utilities_mining', 'engineering', 'entrepreneurial_startups', 'finance_banking', 'food_fmcg', 'forestry', 'healthcare_pharmaceuticals_biotechnology', 'hospitality_leisure', 'infrastructure', 'international_development', 'insurance', 'journalism_communications', 'law_legal_services', 'media_entertainment', 'politics_government', 'production', 'public_sector', 'recruitment_human_resources', 'retail', 'robotics', 'sales_advertising_marketing', 'security', 'sport', 'sustainability_esg', 'technology_data_science_ict', 'telecommunications', 'trade', 'transport');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."skillset_slug" AS ENUM('written_communication', 'verbal_communication', 'interpersonal_skills', 'time_management', 'emotional_intelligence', 'critical_thinking', 'sales', 'leadership_&_management', 'negotiation', 'creativity', 'teamwork', 'financial_literacy', 'analytical_skills', 'problem_solving', 'project_management', 'adaptability', 'delegation', 'data_analysis', 'technical_&_coding_skills', 'research', 'public_speaking_&_presentation', 'social_media_&_content_creation', 'digital_skills', 'marketing', 'strategy', 'organisation', 'attention_to_detail', 'conflict_resolution', 'artistic_skills', 'modelling', 'commercial_awareness', 'enterprise_and_entrepreneurial_skills', 'design', 'videography_&_photography');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_currentyear" AS ENUM('1st_year', '2nd_year', '3rd_year', '4th_year', 'Graduate', 'Postgraduate', 'PHD', 'Other', 'graduate', 'postgraduate', 'phd', 'other');
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
 CREATE TYPE "public"."user_profiletype" AS ENUM('STUDENT', 'ADMIN', 'EXPERT', 'GRADUATE', 'student', 'graduate', 'admin', 'expert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"businessId" varchar(191) NOT NULL,
	"ownerId" varchar(191) NOT NULL,
	"name" varchar(191) NOT NULL,
	"slug" varchar(191) NOT NULL,
	"description" varchar(191) NOT NULL,
	"logoUrl" varchar(191),
	"websiteUrl" varchar(191),
	"admins" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"tiktok" varchar(191) DEFAULT '',
	"instagram" varchar(191) DEFAULT '',
	"linkedin" varchar(191) DEFAULT '',
	"socialHandles" text[] NOT NULL,
	"isPublic" boolean DEFAULT true NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "businessToUser" (
	"userId" integer NOT NULL,
	"businessId" integer NOT NULL,
	"role" "business_role" DEFAULT 'MEMBER' NOT NULL
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
	"description" varchar(191),
	"logoUrl" varchar(191),
	"websiteUrl" varchar(191),
	"isDeleted" boolean DEFAULT false NOT NULL,
	"category" "company_industry" NOT NULL
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
CREATE TABLE IF NOT EXISTS "hobbyInterest" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" "hobbies_interests" NOT NULL,
	"name" varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hobbyInterestToUser" (
	"hobbyInterestId" integer NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "hobbyInterestUserId" PRIMARY KEY("hobbyInterestId","userId")
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
CREATE TABLE IF NOT EXISTS "resource" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"resourceId" varchar(191) NOT NULL,
	"name" varchar(191) NOT NULL,
	"authorId" varchar(191) NOT NULL,
	"description" varchar(191),
	"tags" text[] NOT NULL,
	"url" varchar(191)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewId" varchar(191) NOT NULL,
	"companyId" varchar(191) NOT NULL,
	"companyName" varchar(191) NOT NULL,
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
	"topSkills" text[] NOT NULL,
	"pros" text[] NOT NULL,
	"cons" text[] NOT NULL,
	"interviewQuestions" text[] NOT NULL,
	"topResources" text[] NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"industry" "company_industry" NOT NULL
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
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"clerkId" varchar(191) NOT NULL,
	"email" varchar(191) NOT NULL,
	"firstname" varchar(191) NOT NULL,
	"lastname" varchar(191) NOT NULL,
	"gender" "user_gender" DEFAULT 'female',
	"ethnicity" "user_ethnicity" DEFAULT 'african',
	"age" integer DEFAULT 18 NOT NULL,
	"roleSector" "role_sector" DEFAULT 'robotics',
	"completionYear" integer,
	"broadDegreeCourse" varchar(191),
	"university" varchar(191),
	"degreeName" varchar(191),
	"imageKey" varchar(191),
	"imageUrl" varchar(191),
	"clerkImageHash" varchar(191),
	"profileType" "user_profiletype" DEFAULT 'student' NOT NULL,
	"currentYear" "user_currentyear",
	"experienceType" varchar(191),
	"onboardingStatus" "user_onboardingstatus" DEFAULT 'background_info' NOT NULL,
	"tempPassword" varchar(191) DEFAULT '' NOT NULL,
	"username" varchar(191) DEFAULT '' NOT NULL,
	"workPreference" varchar(191),
	"isActive" boolean DEFAULT true NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "businessIdIdx" ON "business" ("businessId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "businessSlugIdx" ON "business" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49241_comment_authorId_threadId_groupId_idx" ON "comment" ("authorId","threadId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49241_comment_commentId_key" ON "comment" ("commentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "companyIdIdx" ON "company" ("companyId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "companySlugIdx" ON "company" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_groupId_key" ON "group" ("groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_slug_key" ON "group" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "groupUser_userId_groupId_idx" ON "groupUser" ("userId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_key" ON "hobbyInterest" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49267_message_messageId_key" ON "message" ("messageId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49267_message_authorId_groupId_idx" ON "message" ("authorId","groupId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49277_reaction_authorId_messageId_commentId_idx" ON "reaction" ("authorId","messageId","commentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49277_reaction_reactionId_key" ON "reaction" ("reactionId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "referralIdIdx" ON "referral" ("referralId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "resourceIdIdx" ON "resource" ("resourceId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reviewIdIdx" ON "review" ("reviewId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49237_skillset_slug_key" ON "skillset" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49286_thread_authorId_messageId_groupId_idx" ON "thread" ("authorId","messageId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_threadId_key" ON "thread" ("threadId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_messageId_key" ON "thread" ("messageId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "clerkIdUserIdx" ON "user" ("clerkId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "userEmailUserIdx" ON "user" ("email");