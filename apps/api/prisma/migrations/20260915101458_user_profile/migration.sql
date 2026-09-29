-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT 'Admin',
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT 'User',
ADD COLUMN     "maxAccount" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "whatsapp" TEXT;
