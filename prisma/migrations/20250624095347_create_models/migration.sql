/*
  Warnings:

  - You are about to drop the column `marketOutLook` on the `IndustryInsights` table. All the data in the column will be lost.
  - Added the required column `marketOutlook` to the `IndustryInsights` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `demandLevel` on the `IndustryInsights` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DemandLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "MarketOutlook" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGEIVE');

-- AlterTable
ALTER TABLE "IndustryInsights" DROP COLUMN "marketOutLook",
ADD COLUMN     "marketOutlook" "MarketOutlook" NOT NULL,
DROP COLUMN "demandLevel",
ADD COLUMN     "demandLevel" "DemandLevel" NOT NULL;
