/*
  Warnings:

  - You are about to drop the column `WC_Installation_date` on the `AIRCONDITION` table. All the data in the column will be lost.
  - Added the required column `AC_Installation_date` to the `AIRCONDITION` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIRCONDITION" DROP COLUMN "WC_Installation_date",
ADD COLUMN     "AC_Installation_date" TIMESTAMP(3) NOT NULL;
