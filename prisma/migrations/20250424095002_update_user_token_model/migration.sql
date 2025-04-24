/*
  Warnings:

  - You are about to drop the column `token` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenHash]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `UserToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenHash` to the `UserToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserToken_token_key";

-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "token",
DROP COLUMN "updatedAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tokenHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_tokenHash_key" ON "UserToken"("tokenHash");
