-- CreateTable
CREATE TABLE "fridge_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner_name" TEXT NOT NULL,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_name" TEXT NOT NULL,
    "eating_allowed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT NOT NULL
);
