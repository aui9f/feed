"use server";

import db from "@/lib/db";

export async function getAllFeeds() {
  console.log("getAllFeeds");
  try {
    const result = await db.post.findMany({
      include: { images: true, commentList: true },
    });

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
