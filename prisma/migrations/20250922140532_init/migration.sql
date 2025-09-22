-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "retweets" INTEGER NOT NULL DEFAULT 0,
    "images" JSONB NOT NULL,
    "isLiked" BOOLEAN NOT NULL DEFAULT false,
    "isRetweeted" BOOLEAN NOT NULL DEFAULT false,
    "hasMoreComments" BOOLEAN NOT NULL DEFAULT false,
    "userName" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "post_userName_fkey" FOREIGN KEY ("userName") REFERENCES "user" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "commentList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "isLiked" BOOLEAN NOT NULL DEFAULT false,
    "userName" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "commentList_userName_fkey" FOREIGN KEY ("userName") REFERENCES "user" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "commentList_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");
