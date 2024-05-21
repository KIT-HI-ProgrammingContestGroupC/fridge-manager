/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "fridge_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner_name" TEXT NOT NULL,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_name" TEXT NOT NULL,
    "eating_allowed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT NOT NULL
);
