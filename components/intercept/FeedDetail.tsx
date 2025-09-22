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
import { useFeedById } from "@/hooks/useFeed";
import Loading from "@/components/Loading";

export default function FeedDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: feedData, isLoading: feedIsLoading } = useFeedById(id);

  //commentList가져오기
  const { data: commentData } = useQuery({
    queryKey: ["getComment", id],
    queryFn: async () => getComment(Number(id)),
  });

  if (feedIsLoading) return <Loading />;

  if (!feedData) return <p>Not found</p>;

  return (
    <div className="flex gap-4">
      <div className="flex-2">
        <div className="relative w-full ">
          {feedData.images && Array.isArray(feedData.images) ? (
            <div className="relative w-full ">
              <PreviewImages
                isSquare={false}
                images={feedData.images as string[]}
              />
            </div>
          ) : (
            <div className="bg-gray-400 w-full aspect-square"></div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <FeedHeader
          nickname={feedData.author.nickname}
          profileImage={feedData.author.profileImage}
          createdAt={formatDate(new Date(feedData.createdAt))}
          category={feedData.category.name}
        />
        <div className="flex-1">
          <div>{highlightText(feedData.content)}</div>
          <ul>
            {commentData &&
              commentData.map((comment) => (
                <li key={comment.id}>[{comment.author.nickname}]</li>
              ))}
          </ul>
        </div>
        <div>
          <FeedActions
            postId={feedData.id}
            initLikes={feedData.likes}
            initRetweets={feedData.retweets}
            initComments={feedData.commentList.length}
            isInitiallyLiked={feedData.isLiked}
            isInitiallyRetweeted={feedData.isRetweeted}
            isFuncComments={false}
          />
          <div>
            <input />
          </div>
        </div>
      </div>
    </div>
  );
}
