-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneratedAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "type" TEXT NOT NULL,
    "provider" TEXT,
    "prompt" TEXT,
    "path" TEXT,
    "thumbnail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GeneratedAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GeneratedAsset" ("createdAt", "id", "path", "productId", "prompt", "provider", "status", "thumbnail", "type", "updatedAt") SELECT "createdAt", "id", "path", "productId", "prompt", "provider", "status", "thumbnail", "type", "updatedAt" FROM "GeneratedAsset";
DROP TABLE "GeneratedAsset";
ALTER TABLE "new_GeneratedAsset" RENAME TO "GeneratedAsset";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
