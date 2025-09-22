"use server";
import db from "@/lib/db";

export default async function getComment(postId: number) {
  try {
    const result = await db.commentList.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
