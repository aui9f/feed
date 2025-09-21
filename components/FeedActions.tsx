"use client";
import { toggleLike, toggleRetweeted } from "@/app/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { throttle } from "lodash";

/** 여러번 클릭했을때를 대비 -- lodash
 *  특정 시간 동안 함수가 여러 번 호출되는 것을 제어하는 데 유용합니다.
 * 스크롤, 창 크기 변경, 사용자 입력 등 과도한 함수 호출을 방지하기 위해 주로 사용
 */

interface FeedActionsProps {
  postId: number;
  initLikes: number;
  initRetweets: number;
  initComments: number;
  isInitiallyLiked?: boolean;
  isInitiallyRetweeted?: boolean;
  isFuncComments?: boolean;
}

export default function FeedActions({
  postId,
  initLikes,
  initRetweets,
  initComments,
  isInitiallyLiked = false,
  isInitiallyRetweeted = false,
  isFuncComments = true,
}: FeedActionsProps) {
  const router = useRouter();

  const [likes, setLikes] = useState(initLikes);
  const [retweets, setRetweets] = useState(initRetweets);
  const [comments] = useState(initComments);

  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isRetweeted, setIsRetweeted] = useState(isInitiallyRetweeted);

  const handleLike = useCallback(
    throttle(async () => {
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      const newLikeNum = Number(likes) + (newLiked ? 1 : -1);
      setLikes((prev) => prev + (newLiked ? 1 : -1));
      try {
        await toggleLike(postId, newLiked, newLikeNum);
      } catch (err) {
        // 실패 시 롤백
        setIsLiked(isLiked);
        setLikes((prev) => prev + (isLiked ? 1 : -1));
      }
    }, 1000), // 1초에 한 번만 서버 호출
    [isLiked, postId, toggleLike]
  );

  const handleRetweet = useCallback(
    throttle(async () => {
      const newIsRetweeted = !isRetweeted;
      setIsRetweeted(newIsRetweeted);
      setRetweets((prev) => prev + (newIsRetweeted ? 1 : -1));
      try {
        await toggleRetweeted(
          postId,
          newIsRetweeted,
          Number(retweets) + (newIsRetweeted ? 1 : -1)
        );
      } catch (error) {
        setIsRetweeted(isRetweeted);
        setRetweets((prev) => prev + (isRetweeted ? 1 : -1));
      }
    }, 1000),
    [isRetweeted, postId, toggleRetweeted]
  );

  const handleComment = () => {
    if (isFuncComments) {
      router.push(`/${postId}`);
    }
  };

  return (
    <div className="flex gap-4 py-2">
      <button
        type="button"
        onClick={handleLike}
        className={`flex items-center gap-1 hover:opacity-80 ${
          isLiked ? "text-red-500" : "text-gray-400"
        }`}
      >
        <Image
          src={`/images/like${isLiked ? "_active" : ""}.png`}
          alt="좋아요"
          width={24}
          height={24}
        />
        <span className="text-sm">{likes}</span>
      </button>

      <button
        type="button"
        onClick={handleRetweet}
        className={`flex items-center gap-1 hover:opacity-80 ${
          isRetweeted ? "text-green-500" : "text-gray-400"
        }`}
      >
        <Image
          src={`/images/retweet${isRetweeted ? "_active" : ""}.png`}
          alt="리트윗"
          width={24}
          height={24}
        />
        <span className="text-sm">{retweets}</span>
      </button>

      <button
        type="button"
        onClick={handleComment}
        className="flex items-center gap-1 text-gray-400 hover:opacity-80"
      >
        <Image src="/images/comment.png" alt="댓글" width={24} height={24} />
        <span className="text-sm">{comments}</span>
      </button>
    </div>
  );
}
