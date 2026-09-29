-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('USERS_READ', 'USERS_WRITE', 'DEALS_READ', 'DEALS_WRITE', 'PROGRAMS_READ', 'PROGRAMS_WRITE');

-- CreateTable
CREATE TABLE "UserPermission" (
    "userId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("userId","permission")
);

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
