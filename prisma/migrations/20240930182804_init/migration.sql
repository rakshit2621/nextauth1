/*
  Warnings:

  - You are about to drop the column `password` on the `EmailOtpPrisma` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `EmailOtpPrisma` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `EmailPassPrisma` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `EmailOtpPrisma` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `EmailPassPrisma` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `EmailOtpPrisma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `EmailPassPrisma` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EmailOtpPrisma_username_key";

-- DropIndex
DROP INDEX "EmailPassPrisma_username_key";

-- AlterTable
ALTER TABLE "EmailOtpPrisma" DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EmailPassPrisma" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmailOtpPrisma_email_key" ON "EmailOtpPrisma"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailPassPrisma_email_key" ON "EmailPassPrisma"("email");
