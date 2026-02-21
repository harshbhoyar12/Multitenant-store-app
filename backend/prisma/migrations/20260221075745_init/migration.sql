
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Institute" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "UserOrgMap" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserOrgMap_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "UserInstituteMap" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserInstituteMap_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "App" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "launchUrl" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "logoUrl" TEXT,
    "requiredPermissions" JSONB NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "InstituteInstalledApp" (
    "id" SERIAL NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "appId" INTEGER NOT NULL,
    "settings" JSONB NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installedBy" INTEGER NOT NULL,

    CONSTRAINT "InstituteInstalledApp_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "WebhookLog" (
    "id" SERIAL NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "appId" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "statusCode" INTEGER,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);


CREATE UNIQUE INDEX "User_email_key" ON "User"("email");


CREATE INDEX "Institute_organizationId_idx" ON "Institute"("organizationId");


CREATE INDEX "UserOrgMap_organizationId_idx" ON "UserOrgMap"("organizationId");


CREATE INDEX "UserOrgMap_userId_idx" ON "UserOrgMap"("userId");


CREATE UNIQUE INDEX "UserOrgMap_userId_organizationId_key" ON "UserOrgMap"("userId", "organizationId");


CREATE INDEX "UserInstituteMap_instituteId_idx" ON "UserInstituteMap"("instituteId");


CREATE INDEX "UserInstituteMap_userId_idx" ON "UserInstituteMap"("userId");


CREATE UNIQUE INDEX "UserInstituteMap_userId_instituteId_key" ON "UserInstituteMap"("userId", "instituteId");


CREATE INDEX "InstituteInstalledApp_instituteId_idx" ON "InstituteInstalledApp"("instituteId");


CREATE INDEX "InstituteInstalledApp_appId_idx" ON "InstituteInstalledApp"("appId");


CREATE UNIQUE INDEX "InstituteInstalledApp_instituteId_appId_key" ON "InstituteInstalledApp"("instituteId", "appId");


CREATE INDEX "WebhookLog_instituteId_idx" ON "WebhookLog"("instituteId");


CREATE INDEX "WebhookLog_appId_idx" ON "WebhookLog"("appId");

ALTER TABLE "Institute" ADD CONSTRAINT "Institute_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserOrgMap" ADD CONSTRAINT "UserOrgMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserOrgMap" ADD CONSTRAINT "UserOrgMap_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserInstituteMap" ADD CONSTRAINT "UserInstituteMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserInstituteMap" ADD CONSTRAINT "UserInstituteMap_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InstituteInstalledApp" ADD CONSTRAINT "InstituteInstalledApp_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InstituteInstalledApp" ADD CONSTRAINT "InstituteInstalledApp_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InstituteInstalledApp" ADD CONSTRAINT "InstituteInstalledApp_installedBy_fkey" FOREIGN KEY ("installedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WebhookLog" ADD CONSTRAINT "WebhookLog_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WebhookLog" ADD CONSTRAINT "WebhookLog_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
