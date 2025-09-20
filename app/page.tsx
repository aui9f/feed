"use client";
import { getAllFeeds } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const query = useQuery({
    queryKey: ["testFeeds"],
    queryFn: async () => await getAllFeeds(),
  });

  return (
    <div>
      <h1>데이터 확인</h1>
      {query.data?.map((x) => (
        <div key={x.id} className="p-4">
          <p className="font-bold">{x.id}</p>
          <p>{x.content}</p>
          <p>댓글: {x.commentList.length}</p>
          <p>이미지: {x.images.length}</p>
        </div>
      ))}
    </div>
  );
}
