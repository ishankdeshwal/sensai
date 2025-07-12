/*
  Warnings:

  - The values [NEGEIVE] on the enum `MarketOutlook` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MarketOutlook_new" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');
ALTER TABLE "IndustryInsights" ALTER COLUMN "marketOutlook" TYPE "MarketOutlook_new" USING ("marketOutlook"::text::"MarketOutlook_new");
ALTER TYPE "MarketOutlook" RENAME TO "MarketOutlook_old";
ALTER TYPE "MarketOutlook_new" RENAME TO "MarketOutlook";
DROP TYPE "MarketOutlook_old";
COMMIT;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "content" TEXT;
