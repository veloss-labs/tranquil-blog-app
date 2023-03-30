/*
  Warnings:

  - You are about to drop the column `published` on the `posts` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "subTitle" TEXT,
    "description" TEXT,
    "issueDate" DATETIME,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" INTEGER,
    "thumbnailId" INTEGER,
    CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "post_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "posts_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "post_images" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_posts" ("categoryId", "content", "createdAt", "description", "id", "isDraft", "issueDate", "subTitle", "thumbnailId", "title", "updatedAt", "userId") SELECT "categoryId", "content", "createdAt", "description", "id", "isDraft", "issueDate", "subTitle", "thumbnailId", "title", "updatedAt", "userId" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
