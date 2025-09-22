import { QueryClient } from "@tanstack/react-query";

type FeedUpdate = (feed: any) => any;

/**
 * 특정 피드(postId)의 캐시를 업데이트하는 유틸 함수
 */
export function updateFeedCache(
  queryClient: QueryClient,
  postId: number,
  updater: FeedUpdate
) {
  // 상세 페이지 캐시 업데이트
  queryClient.setQueryData(["feed", postId], (old: any) => {
    if (!old) return old;
    return updater(old);
  });

  // 리스트 캐시(useInfiniteQuery 구조 포함)
  queryClient.setQueryData(["feedList"], (old: any) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        items: page.items.map((feed: any) =>
          feed.id === postId ? updater(feed) : feed
        ),
      })),
    };
  });
}
