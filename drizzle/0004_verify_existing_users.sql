-- Email confirmation became required on 2026-11-10. Accounts created before that
-- could not have confirmed, so they count as confirmed instead of being locked out.
UPDATE "user" SET "email_verified" = true WHERE "email_verified" = false;
