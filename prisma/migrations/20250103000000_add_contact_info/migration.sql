-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- Insert default contact info
INSERT INTO "ContactInfo" ("phone", "email", "whatsapp", "address", "updatedAt") 
VALUES ('021-1500-000', 'info@simkeliling.go.id', '0812-3456-7890', 'Jl. Jenderal Sudirman No. 123, Jakarta Pusat 10270', CURRENT_TIMESTAMP);