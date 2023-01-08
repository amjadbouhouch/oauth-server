/*
  Warnings:

  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AccessToken" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Bearer';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "firstName" SET DEFAULT '',
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "lastName" SET DEFAULT '',
ALTER COLUMN "password" SET NOT NULL;
