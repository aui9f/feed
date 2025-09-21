"use client";

import { FeedType } from "@/app/actions";
import FeedActions from "@/components/FeedActions";
import FeedHeader from "@/components/FeedHeader";
import { highlightText } from "@/components/HighlightText";
import PreviewImages from "@/components/PreviewImages";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";

export default function Feed({
  id,
  createdAt,
  content,
  images,
  author,
  category,
  likes,
  isLiked,
  retweets,
  isRetweeted,
  commentList,
}: FeedType) {
  return (
    <li className="w-full ">
      <article className="flex flex-col  border border-gray-200 rounded-md shadow-md">
        <FeedHeader
          nickname={author.nickname}
          profileImage={author.profileImage}
          createdAt={formatDate(new Date(createdAt))}
          category={category.name}
        />
        <div className="relative w-full aspect-square">
          {images.length > 0 && images[0] ? (
            <div className="relative w-full aspect-square">
              <PreviewImages images={images.map((img) => img.url)} />
            </div>
          ) : (
            <div className="bg-gray-400 w-full aspect-square"></div>
          )}
        </div>
        <figure className="px-2 pb-2 my-2">
          <FeedActions
            postId={id}
            initLikes={likes}
            initRetweets={retweets}
            initComments={commentList.length}
            isInitiallyLiked={isLiked}
            isInitiallyRetweeted={isRetweeted}
          />
          <div>{highlightText(content)}</div>
        </figure>
      </article>
    </li>
  );
}
