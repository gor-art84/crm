-- CreateEnum
CREATE TYPE "PartyStatus" AS ENUM ('ACTIVE', 'LIQUIDATING', 'LIQUIDATED', 'BANKRUPT', 'REORGANIZING');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "status" "PartyStatus";
