import { mockCategories } from "../mocks/mockCategories";
import { mockPosts } from "../mocks/mockPosts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // User테이블이 없어서 post, comment에 작성된 유저정보를 가져온다.
  // 중복제거를 위해 Map을 사용
  // commentList에서 빈배열도 있기 때문에 주의
  const usersMap = new Map<
    string,
    {
      name: string;
      nickname: string;
      profileImage: string;
      verified: boolean;
    }
  >();

  mockPosts.forEach((post) => {
    const author = post.author;
    if (!usersMap.has(author.name)) {
      usersMap.set(author.name, {
        name: author.name,
        nickname: author.nickname,
        profileImage: author.profileImage,
        verified: author.verified,
      });
    }

    post.commentList?.forEach((comment) => {
      const cAuthor = comment.author;
      if (!usersMap.has(cAuthor.name)) {
        usersMap.set(cAuthor.name, {
          name: cAuthor.name,
          nickname: cAuthor.nickname,
          profileImage: cAuthor.profileImage,
          verified: cAuthor.verified,
        });
      }
    });
  });

  for (const userData of usersMap.values()) {
    await prisma.user.upsert({
      where: { name: userData.name },
      update: {},
      create: userData,
    });
  }

  //mockCategories 배열을 순회하면서 DB에 넣음, upsert를 사용해 중복 방지
  for (const category of mockCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Posts + Images + Comments
  // 이미지와 댓글은 따로 모델을 생성해서 관계를 설정
  for (const post of mockPosts) {
    await prisma.post.create({
      data: {
        id: post.id,
        userName: post.author.name,
        categoryId: post.category,
        content: post.content,
        likes: post.likes ?? 0,
        retweets: post.retweets ?? 0,
        isLiked: post.isLiked ?? false,
        isRetweeted: post.isRetweeted ?? false,
        hasMoreComments: post.hasMoreComments ?? false,
        createdAt: post.createdAt ? new Date(post.createdAt) : undefined,
        images:
          post.images && post.images.length > 0
            ? {
                create: post.images.map((img) => ({ url: img })),
              }
            : undefined,
        commentList: {
          create:
            post.commentList?.map((c) => ({
              content: c.content || "",
              createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
              likes: c.likes ?? 0,
              isLiked: c.isLiked ?? false,
              userName: c.author.name,
            })) || [],
        },
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
