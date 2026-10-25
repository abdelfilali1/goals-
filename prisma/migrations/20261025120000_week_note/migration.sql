-- CreateTable
CREATE TABLE "WeekNote" (
    "weekStart" DATE NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeekNote_pkey" PRIMARY KEY ("weekStart")
);
