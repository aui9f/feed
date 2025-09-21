// utils/formatDate.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
dayjs.extend(relativeTime);
dayjs.locale("ko"); // 한국어 설정

/**
 * 날짜를 포맷팅합니다.
 * - 7일 이내: "N일 전"
 * - 7일 이상: "YYYY/MM/DD"
 * @param date ISO string | Date | number
 * @returns formatted string
 */

export function formatDate(date: string | Date | number): string {
  const now = dayjs();
  const target = dayjs(date);

  const diffInDays = now.diff(target, "day");

  if (diffInDays < 7) {
    return target.fromNow();
  } else {
    return target.format("YYYY/MM/DD");
  }
}
