/*
  Warnings:

  - You are about to drop the `fridge_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "fridge_items";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "fridges" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "salt_password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner_name" TEXT NOT NULL,
    "uploaded_at" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "eating_allowed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT NOT NULL,
    "fridge_id" INTEGER NOT NULL,
    CONSTRAINT "items_fridge_id_fkey" FOREIGN KEY ("fridge_id") REFERENCES "fridges" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "fridges_user_id_key" ON "fridges"("user_id");
