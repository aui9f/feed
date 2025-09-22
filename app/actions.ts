"use server";

import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export type FeedType = Prisma.postGetPayload<{
  include: { author: true; images: true; category: true; commentList: true };
}>;

export type CategoryType = Prisma.categoryGetPayload<Record<string, never>>;
// 관련된 데이터를 포함하지 않는다.

export async function getCategory() {
  try {
    // === 5초 지연 코드 추가 ===
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // =========================
    return await db.category.findMany();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAllFeeds(
  category: number,
  sort: "asc" | "desc",
  cursor: number | null
) {
  const pageSize = 10;

  // === 5초 지연 코드 추가 ===
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // =========================

  const feeds = await db.post.findMany({
    where: category === 0 ? {} : { categoryId: category },
    orderBy: { createdAt: sort },
    take: pageSize + 1, // 다음 페이지 여부 확인을 위해 +1
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    include: {
      commentList: true,
      category: true,
      author: true,
    },
  });

  let nextCursor: number | null = null;
  if (feeds.length > pageSize) {
    const nextItem = feeds.pop();
    nextCursor = nextItem?.id ?? null;
  }

  return { feeds, nextCursor };
}

export async function getFeedsById(id: number) {
  try {
    return await db.post.findUnique({
      where: { id },
      include: {
        commentList: true,
        category: true,
        author: true,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function toggleLike(id: number, isLiked: boolean, likes: number) {
  // === 5초 지연 코드 추가 ===
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // =========================
  await db.post.update({
    where: {
      id,
    },
    data: {
      isLiked,
      likes: Number(likes),
    },
  });
}

export async function toggleRetweeted(
  id: number,
  isRetweeted: boolean,
  retweets: number
) {
  return await db.post.update({
    where: {
      id,
    },
    data: {
      isRetweeted,
      retweets,
    },
  });
}
