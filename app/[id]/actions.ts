"use server";
import db from "@/lib/db";

export default async function getComment(postId: number) {
  console.log("postId", postId);
  try {
    const result = await db.commentList.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
    });
    console.log("result", result);
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
