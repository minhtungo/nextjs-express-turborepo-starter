CREATE TABLE IF NOT EXISTS "session" (
	"sid" text PRIMARY KEY NOT NULL,
	"sess" text NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "refreshToken";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;