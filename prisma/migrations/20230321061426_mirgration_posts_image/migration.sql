/*
  Warnings:

  - Added the required column `mediaType` to the `post_images` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_post_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "uploadType" TEXT NOT NULL DEFAULT 'etc',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "post_images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_post_images" ("createdAt", "id", "updatedAt", "url", "userId") SELECT "createdAt", "id", "updatedAt", "url", "userId" FROM "post_images";
DROP TABLE "post_images";
ALTER TABLE "new_post_images" RENAME TO "post_images";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
