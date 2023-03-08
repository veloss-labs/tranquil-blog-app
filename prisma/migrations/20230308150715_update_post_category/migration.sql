/*
  Warnings:

  - Added the required column `userId` to the `post_categories` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_post_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "post_categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_post_categories" ("createdAt", "description", "id", "name", "thumbnail", "updatedAt") SELECT "createdAt", "description", "id", "name", "thumbnail", "updatedAt" FROM "post_categories";
DROP TABLE "post_categories";
ALTER TABLE "new_post_categories" RENAME TO "post_categories";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
