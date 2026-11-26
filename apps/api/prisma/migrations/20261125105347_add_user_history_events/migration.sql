-- CreateEnum
CREATE TYPE "UserHistoryEventType" AS ENUM ('ACTIVATED', 'DEACTIVATED');

-- CreateTable
CREATE TABLE "UserHistoryEvent" (
    "id" TEXT NOT NULL,
    "subjectUserId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "type" "UserHistoryEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHistoryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserHistoryEvent_subjectUserId_createdAt_idx" ON "UserHistoryEvent"("subjectUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "UserHistoryEvent" ADD CONSTRAINT "UserHistoryEvent_subjectUserId_fkey" FOREIGN KEY ("subjectUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHistoryEvent" ADD CONSTRAINT "UserHistoryEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
