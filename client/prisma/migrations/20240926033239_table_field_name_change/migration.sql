/*
  Warnings:

  - The primary key for the `MESSAGE` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dateTime` on the `MESSAGE` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `MESSAGE` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `MESSAGE` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `MESSAGE` table. All the data in the column will be lost.
  - You are about to drop the column `receiver` on the `MESSAGE` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `MESSAGE` table. All the data in the column will be lost.
  - The required column `M_Id` was added to the `MESSAGE` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `M_Receiver` to the `MESSAGE` table without a default value. This is not possible if the table is not empty.
  - Added the required column `M_Sender` to the `MESSAGE` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MESSAGE" DROP CONSTRAINT "MESSAGE_pkey",
DROP COLUMN "dateTime",
DROP COLUMN "id",
DROP COLUMN "image",
DROP COLUMN "message",
DROP COLUMN "receiver",
DROP COLUMN "sender",
ADD COLUMN     "M_DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "M_Id" TEXT NOT NULL,
ADD COLUMN     "M_Image" TEXT,
ADD COLUMN     "M_Message" TEXT,
ADD COLUMN     "M_Receiver" TEXT NOT NULL,
ADD COLUMN     "M_Sender" TEXT NOT NULL,
ADD CONSTRAINT "MESSAGE_pkey" PRIMARY KEY ("M_Id");
