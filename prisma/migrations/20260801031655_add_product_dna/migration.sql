-- CreateTable
CREATE TABLE "ProductDNA" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "sku" TEXT,
    "brand" TEXT,
    "category" TEXT,
    "ageRange" TEXT,
    "gender" TEXT,
    "material" TEXT,
    "finishing" TEXT,
    "visor" TEXT,
    "buckle" TEXT,
    "weight" TEXT,
    "sni" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "pattern" TEXT,
    "logoPosition" TEXT,
    "brandLock" BOOLEAN NOT NULL DEFAULT true,
    "shapeLock" BOOLEAN NOT NULL DEFAULT true,
    "materialLock" BOOLEAN NOT NULL DEFAULT true,
    "graphicLock" BOOLEAN NOT NULL DEFAULT true,
    "logoLock" BOOLEAN NOT NULL DEFAULT true,
    "colorLock" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductDNA_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDNA_productId_key" ON "ProductDNA"("productId");
