"use server";
import { getUser } from "@/app/actions/getUser";
import db from "@/lib/db";
import { start } from "repl";

export async function getComment(postId: number) {
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

export async function setCommentForm(_: unknown, formData: FormData) {
  console.log("--CommentForm--");
  const user = await getUser();
  if (!user) {
    return {
      statue: 401,
      message: "로그인 사용자만 이용 가능합니다.",
    };
  }

  const inputData = {
    comment: formData.get("comment") as string,
    postId: formData.get("postId") as string,
  };
  //zod 유효성검사 - 생략
  try {
    await db.commentList.create({
      data: {
        content: inputData.comment.replace(/\n/gi, ""), //댓글을 줄바꿈 생략
        userName: user.name,
        postId: Number(inputData.postId),
        isLiked: false,
      },
      select: {
        id: true,
      },
    });

    return {
      statue: 200,
      message: "",
    };
  } catch (error) {
    console.log(error);
    return {
      statue: 401,
      message: "댓글작성에실패했습니다.",
    };
  }
}
