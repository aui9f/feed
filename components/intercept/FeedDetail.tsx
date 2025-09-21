"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { FeedType, getFeedsById } from "@/app/actions";
import FeedHeader from "@/components/FeedHeader";
import { formatDate } from "@/utils/formatDate";
import PreviewImages from "@/components/PreviewImages";
import { highlightText } from "@/components/HighlightText";
import FeedActions from "@/components/FeedActions";
import getComment from "@/app/[id]/actions";

export default function FeedDetail() {
  const { id } = useParams<{ id: string }>();

  // 1. 캐시에서 데이터 가져오기
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(["getFeeds"]) as
    | { pages: { feeds: FeedType[] }[] }
    | undefined;
  const cachedRecipes = cachedData?.pages?.flatMap((page) => page.feeds) ?? [];

  const feedFromCache = cachedRecipes.find(
    (r: FeedType) => r.id === Number(id)
  );
  // 2. 캐시에 없으면 API 호출
  const { data, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => getFeedsById(Number(id)),
    enabled: !feedFromCache, // 캐시에 데이터가 있으면 API 호출을 하지 않음
  });

  const feed = feedFromCache || data || null;

  //commentList가져오기
  const { data: commentData } = useQuery({
    queryKey: ["getComment", id],
    queryFn: async () => getComment(Number(id)),
  });

  if (isLoading) return <p>Loading...</p>;
  if (!feed) return <p>Not found</p>;

  return (
    <div className="flex gap-4">
      <div className="flex-2">
        <div className="relative w-full ">
          {feed.images.length > 0 && feed.images[0] ? (
            <div className="relative w-full ">
              <PreviewImages
                isSquare={false}
                images={feed.images.map((img) => img.url)}
              />
            </div>
          ) : (
            <div className="bg-gray-400 w-full aspect-square"></div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <FeedHeader
          nickname={feed.author.nickname}
          profileImage={feed.author.profileImage}
          createdAt={formatDate(new Date(feed.createdAt))}
          category={feed.category.name}
        />
        <div className="flex-1">
          <div>{highlightText(feed.content)}</div>
          <ul>
            {commentData &&
              commentData.map((comment) => (
                <li key={comment.id}>[{comment.author.nickname}]</li>
              ))}
          </ul>
        </div>
        <div>
          <FeedActions
            postId={feed.id}
            initLikes={feed.likes}
            initRetweets={feed.retweets}
            initComments={feed.commentList.length}
            isInitiallyLiked={feed.isLiked}
            isInitiallyRetweeted={feed.isRetweeted}
            isFuncComments={false}
          />
          <div>
            <input />
            <button>게시</button>
          </div>
        </div>
      </div>
    </div>
  );
}
