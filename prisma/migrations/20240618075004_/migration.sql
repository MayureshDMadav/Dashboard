/*
  Warnings:

  - Added the required column `bookedarr` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedarr` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gmv` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `livedate` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ms` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesrep` to the `merchants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "bookedarr" INTEGER NOT NULL,
ADD COLUMN     "expectedarr" INTEGER NOT NULL,
ADD COLUMN     "gmv" INTEGER NOT NULL,
ADD COLUMN     "livedate" TEXT NOT NULL,
ADD COLUMN     "ms" TEXT NOT NULL,
ADD COLUMN     "salesrep" TEXT NOT NULL;
