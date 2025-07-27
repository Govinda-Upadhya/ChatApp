/*
  Warnings:

  - You are about to drop the `_RoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_B_fkey";

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_RoomToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_roomId_key" ON "Friendship"("roomId");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
