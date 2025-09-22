import { CategoryType, getCategory } from "@/app/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useCategoryList = () => {
  const queryClient = useQueryClient();

  // 1. 캐시에서 데이터 가져오기
  const cachedCategory = queryClient.getQueryData<CategoryType[]>([
    "getCategory",
  ]);

  // 2. 캐시에 없으면 API 호출
  const { data, isLoading } = useQuery<CategoryType[]>({
    queryKey: ["getCategory"],
    queryFn: () => getCategory(),
    enabled: !cachedCategory, // 캐시에 데이터가 있을 경우 API 호출을 비활성화
  });

  // 3. 캐시 데이터 또는 API 응답 데이터 반환
  const categoryList = cachedCategory || data;

  return { data: categoryList, isLoading };
};
