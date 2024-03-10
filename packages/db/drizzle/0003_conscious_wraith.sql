DROP INDEX IF EXISTS "idx_49259_groupuser_userId_groupId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49295_user_clerkId_key";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49295_user_email_key";--> statement-breakpoint
ALTER TABLE "careerInterestToUser" DROP CONSTRAINT "careerInterestToUser_careerInterestId_userId_pk";--> statement-breakpoint
ALTER TABLE "careerInterestToUser" ADD CONSTRAINT "careerInterestUserId" PRIMARY KEY("careerInterestId","userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "groupUser_userId_groupId_idx" ON "groupUser" ("userId","groupId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "clerkIdIdx" ON "user" ("clerkId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailIdx" ON "user" ("email");