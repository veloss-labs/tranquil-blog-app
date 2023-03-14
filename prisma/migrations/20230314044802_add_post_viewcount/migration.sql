-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "subTitle" TEXT,
    "content" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
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
INSERT INTO "new_posts" ("categoryId", "content", "createdAt", "id", "issueDate", "likeCount", "published", "subTitle", "thumbnailId", "title", "updatedAt", "userId") SELECT "categoryId", "content", "createdAt", "id", "issueDate", "likeCount", "published", "subTitle", "thumbnailId", "title", "updatedAt", "userId" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE TABLE "new_post_stats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "score" REAL NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_stats_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_post_stats" ("clicks", "commentsCount", "id", "likes", "postId", "score", "updatedAt") SELECT "clicks", "commentsCount", "id", "likes", "postId", "score", "updatedAt" FROM "post_stats";
DROP TABLE "post_stats";
ALTER TABLE "new_post_stats" RENAME TO "post_stats";
CREATE UNIQUE INDEX "post_stats_postId_key" ON "post_stats"("postId");
CREATE INDEX "post_stats_score_postId_idx" ON "post_stats"("score" DESC, "postId" DESC);
CREATE INDEX "post_stats_likes_postId_idx" ON "post_stats"("likes" DESC, "postId" DESC);
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
