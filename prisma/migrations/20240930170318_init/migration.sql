-- CreateTable
CREATE TABLE "UserPassPrisma" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "UserPassPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailPassPrisma" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "EmailPassPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailOtpPrisma" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "EmailOtpPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPassPrisma_username_key" ON "UserPassPrisma"("username");

-- CreateIndex
CREATE UNIQUE INDEX "EmailPassPrisma_username_key" ON "EmailPassPrisma"("username");

-- CreateIndex
CREATE UNIQUE INDEX "EmailOtpPrisma_username_key" ON "EmailOtpPrisma"("username");
