"use server";

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { getUser } from "@/app/actions/getUser";

export async function FeedForm(_: unknown, formData: FormData) {
  const user = await getUser();
  if (!user) {
    return {
      statue: 401,
      message: "로그인 사용자만 이용 가능합니다.",
    };
  }

  const inputData = {
    category: formData.get("category") as string,
    images: formData.getAll("images") as File[],
    content: formData.get("content") as string,
  };

  //zod 유효성검사 - 생략

  //이미지 로컬에 저장
  const feedDir = path.join(process.cwd(), "public", "feed");

  // 폴더 없으면 생성
  if (!fs.existsSync(feedDir)) {
    fs.mkdirSync(feedDir, { recursive: true });
  }

  // 이미지 저장
  const savedImages: string[] = [];

  for (const file of inputData.images) {
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.type.split("/")[1] || "jpg";
      const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
      const filePath = path.join(feedDir, fileName);
      fs.writeFileSync(filePath, buffer);
      savedImages.push(`/feed/${fileName}`);
    }
  }

  //데이터저장 후 아이디 리턴
  try {
    const result = await db.post.create({
      data: {
        content: inputData.content, //.replace(/\n/gi, ""),
        userName: user.name,
        categoryId: Number(inputData.category),
        images: [...savedImages],
        // likes, retweets, isLiked, isRetweeted, hasMoreComments는 기본값으로 자동 세팅
      },
      select: {
        id: true,
      },
    });

    return {
      status: 200,
      id: result.id,
    };
  } catch (error) {
    console.log("error", error);
    return {
      status: 401,
      id: 0,
    };
  }
}
