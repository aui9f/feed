"use client";
import FeedDetail from "@/components/intercept/FeedDetail";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Details() {
  const router = useRouter();
  const onClose = () => {
    router.push("/");
  };
  return (
    <div className="write-layout w-full my-8 mx-auto  sm:shadow-lg sm:w-4xl sm:border-b sm:border-b-gray-100">
      <div className="hidden h-10 px-1 border-b border-b-gray-200 items-center justify-end sm:flex">
        <div className="" onClick={onClose}>
          <Image
            src={"/images/close_black.png"}
            alt="모달닫기"
            width={24}
            height={24}
          />
        </div>
      </div>
      <FeedDetail />
    </div>
  );
}
