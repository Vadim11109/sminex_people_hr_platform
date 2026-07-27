-- CreateEnum
CREATE TYPE "RaterRole" AS ENUM ('CUSTOMER', 'RCE');

-- CreateTable
CREATE TABLE "ExternalReview" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "role" "RaterRole" NOT NULL,
    "email" TEXT NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "generalNote" TEXT,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExternalReview_email_idx" ON "ExternalReview"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalReview_assignmentId_role_email_key" ON "ExternalReview"("assignmentId", "role", "email");

-- AddForeignKey
ALTER TABLE "ExternalReview" ADD CONSTRAINT "ExternalReview_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
