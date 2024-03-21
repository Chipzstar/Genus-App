DO $$ BEGIN
 CREATE TYPE "user_currentyear" AS ENUM('1st_year', '2nd_year', '3rd_year', '4th_year', 'Graduate', 'Postgraduate', 'PHD', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "currentYear" SET DATA TYPE user_currentyear;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "currentYear" SET DEFAULT '1st_year';