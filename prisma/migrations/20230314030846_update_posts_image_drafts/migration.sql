/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `posts` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "post_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "post_images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostDraft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PostDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "subTitle" TEXT,
    "content" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" INTEGER,
    "thumbnailId" INTEGER,
    CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "post_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "posts_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "post_images" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_posts" ("categoryId", "content", "createdAt", "id", "issueDate", "likeCount", "published", "subTitle", "title", "updatedAt", "userId") SELECT "categoryId", "content", "createdAt", "id", "issueDate", "likeCount", "published", "subTitle", "title", "updatedAt", "userId" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
