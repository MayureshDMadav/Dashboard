-- CreateTable
CREATE TABLE "merchants" (
    "id" SERIAL NOT NULL,
    "cename" TEXT NOT NULL,
    "merchantname" TEXT NOT NULL,
    "merchantwebsite" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "kickoff" TIMESTAMP(3) NOT NULL,
    "targetgolive" TIMESTAMP(3) NOT NULL,
    "checkouttype" TEXT NOT NULL,
    "mintcomment" TEXT NOT NULL,
    "golivecommit" TEXT NOT NULL,
    "opscomment" TEXT NOT NULL,
    "Age" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);
