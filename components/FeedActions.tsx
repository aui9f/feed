"use client";
import { toggleLike, toggleRetweeted } from "@/app/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { throttle } from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const [likes, setLikes] = useState(initLikes);
  const [retweets, setRetweets] = useState(initRetweets);
  const [comments] = useState(initComments);

  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isRetweeted, setIsRetweeted] = useState(isInitiallyRetweeted);

  // 좋아요 뮤테이션 -- 아직 modal에서 변경이 실시간 변경이 안됨
  const { mutate: handleLikeMutation } = useMutation({
    mutationFn: async () => {
      const newLikedStatus = !isLiked;
      const newLikeCount = likes + (newLikedStatus ? 1 : -1);
      // UI 낙관적 업데이트
      setIsLiked(newLikedStatus);
      setLikes(newLikeCount);
      try {
        await toggleLike(postId, newLikedStatus, newLikeCount);
        return { newLikedStatus, newLikeCount }; // 성공 시 반환
      } catch (err) {
        // 서버 요청 실패 시 UI 상태 롤백
        setIsLiked(isLiked);
        setLikes(likes);
        throw err; // 에러를 다시 throw하여 onError 콜백이 호출되도록 함
      }
    },
    onSuccess: ({ newLikedStatus, newLikeCount }) => {
      // 서버 요청 성공 시 캐시를 직접 업데이트하여 UI를 즉시 반영합니다.
      // 쿼리 키가 ['getFeeds']로 시작하는 모든 쿼리에 대해 데이터를 업데이트합니다.

      queryClient.setQueryData(["getFeeds", "0", "desc"], (oldData: any) => {
        if (!oldData) return oldData;
        // 모든 페이지를 순회하며 변경된 게시물의 좋아요 수를 업데이트합니다.

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            feeds: page.feeds.map((feed: any) =>
              Number(feed.id) === Number(postId)
                ? {
                    ...feed,
                    isLiked: newLikedStatus,
                    likes: newLikeCount,
                  }
                : feed
            ),
          })),
        };
      });
    },
    onError: (error) => {
      console.error("좋아요 업데이트 실패:", error);
    },
  });

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
        onClick={handleLikeMutation}
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
        {comments > 0 && <span className="text-sm">{comments}</span>}
      </button>
    </div>
  );
}
