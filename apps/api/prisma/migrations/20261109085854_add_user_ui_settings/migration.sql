-- CreateEnum
CREATE TYPE "UiThemeMode" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "UiDensity" AS ENUM ('COMPACT', 'DEFAULT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "density" "UiDensity",
ADD COLUMN     "themeMode" "UiThemeMode";
