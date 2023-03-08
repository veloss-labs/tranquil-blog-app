/*
  Warnings:

  - You are about to drop the column `role` on the `user_roles` table. All the data in the column will be lost.
  - Added the required column `authority` to the `user_roles` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_roles" ("id", "userId") SELECT "id", "userId" FROM "user_roles";
DROP TABLE "user_roles";
ALTER TABLE "new_user_roles" RENAME TO "user_roles";
CREATE UNIQUE INDEX "user_roles_userId_key" ON "user_roles"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
