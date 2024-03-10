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
 CREATE TYPE "user_profileType" AS ENUM('STUDENT', 'ADMIN', 'EXPERT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "careerinterest" RENAME TO "careerInterest";--> statement-breakpoint
ALTER TABLE "_careerinteresttouser" RENAME TO "_careerInterestToUser";--> statement-breakpoint
ALTER TABLE "groupuser" RENAME TO "groupUser";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "createdat" TO "createdAt";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "updatedat" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "commentid" TO "commentId";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "authorid" TO "authorId";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "threadid" TO "threadId";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "groupid" TO "groupId";--> statement-breakpoint
ALTER TABLE "group" RENAME COLUMN "createdat" TO "createdAt";--> statement-breakpoint
ALTER TABLE "group" RENAME COLUMN "updatedat" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "group" RENAME COLUMN "groupid" TO "groupId";--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "createdat" TO "createdAt";--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "updatedat" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "messageid" TO "messageId";--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "authorid" TO "authorId";--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "groupid" TO "groupId";--> statement-breakpoint
ALTER TABLE "reaction" RENAME COLUMN "createdat" TO "createdAt";--> statement-breakpoint
ALTER TABLE "reaction" RENAME COLUMN "updatedat" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "reaction" RENAME COLUMN "reactionid" TO "reactionId";--> statement-breakpoint
ALTER TABLE "reaction" RENAME COLUMN "authorid" TO "authorId";--> statement-breakpoint
ALTER TABLE "reaction" RENAME COLUMN "messageid" TO "messageId";--> statement-breakpoint
ALTER TABLE "reaction" RENAME COLUMN "commentid" TO "commentId";--> statement-breakpoint
ALTER TABLE "thread" RENAME COLUMN "createdat" TO "createdAt";--> statement-breakpoint
ALTER TABLE "thread" RENAME COLUMN "updatedat" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "thread" RENAME COLUMN "threadid" TO "threadId";--> statement-breakpoint
ALTER TABLE "thread" RENAME COLUMN "authorid" TO "authorId";--> statement-breakpoint
ALTER TABLE "thread" RENAME COLUMN "messageid" TO "messageId";--> statement-breakpoint
ALTER TABLE "thread" RENAME COLUMN "groupid" TO "groupId";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "createdat" TO "createdAt";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "updatedat" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "clerkid" TO "clerkId";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "completionyear" TO "completionYear";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "broaddegreecourse" TO "broadDegreeCourse";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "degreename" TO "degreeName";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "imagekey" TO "imageKey";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "imageurl" TO "imageUrl";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "clerkimagehash" TO "clerkImageHash";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "profiletype" TO "profileType";--> statement-breakpoint
ALTER TABLE "groupUser" RENAME COLUMN "userid" TO "userId";--> statement-breakpoint
ALTER TABLE "groupUser" RENAME COLUMN "groupid" TO "groupId";--> statement-breakpoint
ALTER TABLE "groupUser" RENAME COLUMN "imageurl" TO "imageUrl";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49241_comment_authorid_threadid_groupid_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49241_comment_commentid_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49250_group_groupid_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49267_message_messageid_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49267_message_authorid_groupid_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49277_reaction_authorid_messageid_commentid_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49277_reaction_reactionid_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49286_thread_authorid_messageid_groupid_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49286_thread_threadid_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49286_thread_messageid_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49295_user_clerkid_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49236_careerinterest_slug_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49259_groupuser_userid_groupid_idx";--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reaction" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reaction" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "thread" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "thread" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "profileType" SET DATA TYPE user_profileType;--> statement-breakpoint
ALTER TABLE "careerInterest" ALTER COLUMN "slug" SET DATA TYPE careerInterest_slug;--> statement-breakpoint
ALTER TABLE "groupUser" ALTER COLUMN "role" SET DATA TYPE groupUser_role;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49241_comment_authorId_threadId_groupId_idx" ON "comment" ("authorId","threadId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49241_comment_commentId_key" ON "comment" ("commentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49250_group_groupId_key" ON "group" ("groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49267_message_messageId_key" ON "message" ("messageId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49267_message_authorId_groupId_idx" ON "message" ("authorId","groupId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49277_reaction_authorId_messageId_commentId_idx" ON "reaction" ("authorId","messageId","commentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49277_reaction_reactionId_key" ON "reaction" ("reactionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49286_thread_authorId_messageId_groupId_idx" ON "thread" ("authorId","messageId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_threadId_key" ON "thread" ("threadId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49286_thread_messageId_key" ON "thread" ("messageId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49295_user_clerkId_key" ON "user" ("clerkId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_49236_careerInterest_slug_key" ON "careerInterest" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_49259_groupuser_userId_groupId_idx" ON "groupUser" ("userId","groupId");