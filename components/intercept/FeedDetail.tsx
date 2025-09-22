"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import FeedHeader from "@/components/FeedHeader";
import { formatDate } from "@/utils/formatDate";
import PreviewImages from "@/components/PreviewImages";
import { highlightText } from "@/components/HighlightText";
import FeedActions from "@/components/FeedActions";
import { getComment, setCommentForm } from "@/app/[id]/actions";

import Loading from "@/components/Loading";
import Comment from "@/components/Comment";
import { useActionState, useEffect, useState } from "react";
import Input from "@/components/forms/Input";
import Button, { variantEnum } from "@/components/forms/Button";
import { useFeedById } from "@/hooks/useFeed";

export default function FeedDetail() {
  const [state, formAction] = useActionState(setCommentForm, null);
  const { id } = useParams<{ id: string }>();
  const { data: feedData, isLoading: feedIsLoading } = useFeedById(id);
  const [inputComment, setInputComment] = useState("");

  //commentList가져오기
  const { data: commentData, refetch } = useQuery({
    queryKey: ["getComment", id],
    queryFn: async () => getComment(Number(id)),
  });

  // Place hooks before any early returns
  useEffect(() => {
    if (state?.statue === 200) {
      setInputComment(""); //초기화
      refetch();
    }
  }, [state]);

  if (feedIsLoading) return <Loading />;
  if (!feedData) return <p>Not found</p>;

  return (
    <div className="flex gap-2 px-2 flex-col  sm:flex-row ">
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
      <div className="flex-1 flex flex-col gap-4 sm:max-h-[640px] ">
        <FeedHeader
          nickname={feedData.author.nickname}
          profileImage={feedData.author.profileImage}
          createdAt={formatDate(new Date(feedData.createdAt))}
          category={feedData.category.name}
        />
        <div className="flex-1 flex flex-col sm:overflow-auto ">
          <div className="flex-1 text-gray-600">
            {highlightText(feedData.content)}
          </div>
          <ul className="flex-1 text-gray-600">
            {commentData &&
              commentData.map((comment) => (
                <Comment key={comment.id} {...comment} />
              ))}
          </ul>
        </div>
        <div>
          <FeedActions
            postId={feedData.id}
            initLikes={feedData.likes}
            initRetweets={feedData.retweets}
            initComments={0}
            isInitiallyLiked={feedData.isLiked}
            isInitiallyRetweeted={feedData.isRetweeted}
            isFuncComments={false}
          />
          <form action={formAction} className="flex gap-1 py-2">
            <input type="hidden" name="postId" value={id} />
            <Input
              name="comment"
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant={variantEnum.dark}>
              게시
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
