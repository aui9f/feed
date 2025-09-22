import { FeedType, getFeedsById } from "@/app/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useFeedById = (id: string) => {
  // 1. 캐시에서 데이터 가져오기
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(["getFeeds"]) as
    | { pages: { feeds: FeedType[] }[] }
    | undefined;
  const cachedFeed = cachedData?.pages?.flatMap((page) => page.feeds) ?? [];

  const feedFromCache = cachedFeed.find((r: FeedType) => r.id === Number(id));

  // 2. 캐시에 없으면 API 호출
  const { data, isLoading } = useQuery({
    queryKey: ["getFeedsId", id],
    queryFn: async () => getFeedsById(Number(id)),
    enabled: !feedFromCache, // 캐시에 데이터가 있으면 API 호출을 하지 않음
  });

  const feed = feedFromCache || data || null;
  return { data: feed, isLoading };
};
