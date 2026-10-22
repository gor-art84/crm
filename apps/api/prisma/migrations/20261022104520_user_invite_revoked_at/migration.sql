-- AlterTable
ALTER TABLE "UserInvite" ADD COLUMN     "revokedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "UserInvite_userId_idx" ON "UserInvite"("userId");
