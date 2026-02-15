-- CreateTable
CREATE TABLE "Rsvp" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "willAttend" BOOLEAN NOT NULL,
    "extraAdultNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "childNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "acceptedTerms" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);
