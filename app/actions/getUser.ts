import db from "@/lib/db";
import { currentUser } from "../../mocks/mockUser";

export type UserType = {
  id: string;
  name: string;
  nickname: string;
  profileImage: string;
  verified: boolean;
};

export async function getUser() {
  // ! User테이블이 따로 없어 피드, 답변에서 사용자를 뽑아서 저장했는데,
  // mockUser의 정보가 없어서 여기서 따로 저장
  let id = "";
  // 1. User테이블에 정보가 있는지확인
  const isUser = await db.user.findUnique({
    where: { name: currentUser.name },
    select: { id: true },
  });

  if (isUser) {
    id = isUser?.id;
  }

  // 2. 없으면 저장
  if (!isUser) {
    const user = await db.user.create({
      data: {
        name: currentUser.name,
        nickname: currentUser.nickname,
        profileImage: currentUser.profileImage,
        verified: currentUser.verified,
      },
      select: { id: true },
    });
    id = user.id;
  }

  // 로그인 유저 정보 가져오기
  return { id, ...currentUser };
}
