-- Simplify subscription tiers from FREE/PRO/PREMIUM to FREE/PAID

-- Step 1: Convert existing PRO and PREMIUM users to FREE temporarily
UPDATE "TradesProfile" SET "subscriptionTier" = 'FREE' WHERE "subscriptionTier" IN ('PRO', 'PREMIUM');

-- Step 2: Remove the default from the column temporarily
ALTER TABLE "TradesProfile" ALTER COLUMN "subscriptionTier" DROP DEFAULT;

-- Step 3: Create the new enum type
CREATE TYPE "SubscriptionTier_new" AS ENUM ('FREE', 'PAID');

-- Step 4: Alter the column to use the new enum
ALTER TABLE "TradesProfile"
  ALTER COLUMN "subscriptionTier" TYPE "SubscriptionTier_new"
  USING ("subscriptionTier"::text::"SubscriptionTier_new");

-- Step 5: Drop the old enum and rename the new one
DROP TYPE "SubscriptionTier";
ALTER TYPE "SubscriptionTier_new" RENAME TO "SubscriptionTier";

-- Step 6: Restore the default
ALTER TABLE "TradesProfile" ALTER COLUMN "subscriptionTier" SET DEFAULT 'FREE'::"SubscriptionTier";
