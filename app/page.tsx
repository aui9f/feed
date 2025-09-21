"use client";
import { getAllFeeds, getCategory } from "@/app/actions";
import Feed from "@/components/Feed";
import FeedSkeleton from "@/components/FeedSkeleton";
import Radio from "@/components/forms/Radio";
import SelectBox from "@/components/forms/SelectBox";
import { FormOption } from "@/types/ui";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [selectedSort, setSelectedSort] = useState<"asc" | "desc">("desc");

  // 1. 카테고리 -- 1시간 동안 캐시 유지
  const { data: categoryData } = useQuery({
    queryKey: ["getCategory"],
    queryFn: () => getCategory(),
    staleTime: 1000 * 60 * 60,
  });

  //2. 피드리스트
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["getFeeds", selectedCategory, selectedSort],
      queryFn: ({ pageParam }) =>
        getAllFeeds(
          Number(selectedCategory),
          selectedSort,
          pageParam as number
        ),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      // staleTime: 0, // 항상 fresh 상태로 간주 → 요청마다 refetch
      // gcTime: 0, // 캐시 바로 제거
      staleTime: 1000 * 60,
      refetchOnWindowFocus: true, // 창에 다시 포커스 시 새로 요청
      refetchOnReconnect: true, // 네트워크 재연결 시 새로 요청
    });

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  // 1-2. 카테고리 select prop에 맞게 수정
  const categoryOptions: FormOption[] = categoryData
    ? categoryData.map((category) => ({
        id: String(category.id),
        label: category.name,
      }))
    : [];

  // 정렬
  const sortOptions = [
    { id: "desc", label: "최신순" },
    { id: "asc", label: "등록순" },
  ];

  // IntersectionObserver
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="flex flex-col gap-4 w-full mx-auto sm:w-[470px]">
      <div className="flex gap-4 justify-end">
        <SelectBox
          name="category"
          options={[...[{ id: "0", label: "전체" }], ...categoryOptions]}
          selected={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={isLoading || isFetchingNextPage}
        />

        <div className="flex gap-4">
          <Radio
            name="sort"
            options={sortOptions}
            selected={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as "asc" | "desc")}
            disabled={isLoading || isFetchingNextPage}
          />
        </div>
      </div>

      <ul className="flex flex-col gap-4">
        {feeds.map((feed) => (
          <Feed key={feed.id} {...feed} />
        ))}

        {isLoading &&
          Array.from({ length: 5 }).map((_, idx) => <FeedSkeleton key={idx} />)}

        {/* 추가 로딩 중일 땐 하나만.. */}
        {isFetchingNextPage && <FeedSkeleton />}
      </ul>

      <div ref={loadMoreRef} className="h-10"></div>
    </section>
  );
}
