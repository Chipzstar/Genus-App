DO $$ BEGIN
 CREATE TYPE "public"."company_industry" AS ENUM('banking_finance', 'law', 'consulting', 'tech', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "company" DROP COLUMN "category";
ALTER TABLE "company" ADD COLUMN "category" company_industry;
ALTER TABLE "review" DROP COLUMN "industry";
ALTER TABLE "review" ADD COLUMN "industry" company_industry;
