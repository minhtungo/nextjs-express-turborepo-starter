ALTER TABLE "account" ADD COLUMN "type" "type" NOT NULL;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "accountType";--> statement-breakpoint
ALTER TABLE "refreshToken" DROP COLUMN IF EXISTS "expires";--> statement-breakpoint
ALTER TABLE "userSetting" DROP COLUMN IF EXISTS "preferredLang";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "academicLevel";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "goals";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "subjects";--> statement-breakpoint
ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_userId_unique" UNIQUE("userId");