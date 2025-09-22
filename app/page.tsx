"use client";
import { CategoryType, getAllFeeds, getCategory } from "@/app/actions";
import Feed from "@/components/Feed";
import FeedSkeleton from "@/components/FeedSkeleton";
import Radio from "@/components/forms/Radio";
import SelectBox from "@/components/forms/SelectBox";
import { FormOption } from "@/types/ui";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [selectedSort, setSelectedSort] = useState<"asc" | "desc">("desc");

  // 1. 카테고리 -- 1시간 동안 캐시 유지
  const { data: categoryData } = useQuery<CategoryType[]>({
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

      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
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
    <section className="flex flex-col  w-full mx-auto sm:w-[470px]">
      <div className="flex gap-3 justify-end py-2 p-1">
        <SelectBox
          name="category"
          options={[...[{ id: "0", label: "전체" }], ...categoryOptions]}
          selected={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={isLoading || isFetchingNextPage}
        />

        <div className="flex gap-1">
          <Radio
            name="sort"
            options={sortOptions}
            selected={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as "asc" | "desc")}
            disabled={isLoading || isFetchingNextPage}
          />
        </div>
        <Link
          href="/feed/create"
          className="flex items-center sm:fixed right-14 bottom-14  text-blue-400 rounded-md cursor-pointer text-sm sm:block *:cursor-pointer
          sm:p-2 sm:rounded-full sm:bg-blue-400 sm:text-white
          "
        >
          <Image
            src={"/images/plus.png"}
            alt="피드작성"
            width={18}
            height={18}
            className="m-auto hidden sm:block"
          />
          <p className="text-sm">글작성</p>
        </Link>
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
