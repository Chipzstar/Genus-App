ALTER TABLE "_careerInterestToUser" RENAME TO "careerInterestToUser";--> statement-breakpoint
ALTER TABLE "careerInterestToUser" RENAME COLUMN "a" TO "careerInterestId";--> statement-breakpoint
ALTER TABLE "careerInterestToUser" RENAME COLUMN "b" TO "userId";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49306__careerinteresttouser_b_index";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_49306__careerinteresttouser_ab_unique";--> statement-breakpoint
ALTER TABLE "careerInterestToUser" ADD CONSTRAINT "careerInterestToUser_careerInterestId_userId_pk" PRIMARY KEY("careerInterestId","userId");