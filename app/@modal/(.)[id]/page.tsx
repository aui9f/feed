"use client";

import FeedDetail from "@/components/intercept/FeedDetail";
import { useModalStore } from "@/store/modalStore";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DetailModal() {
  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter(); // useRouter 훅 사용
  const { setModal } = useModalStore();
  const id = params.id;
  const onClose = () => {
    //

    // queryClient.invalidateQueries({ queryKey: ["getFeeds"] });
    setModal(false);
    router.back(); // 이 코드가 뒤로가기 기능을 수행합니다.
  };
  useEffect(() => {
    setModal(true);
    return () => {
      setModal(false);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 top-0 bottom-0 flex items-center justify-center bg-black/60">
      <div
        className=" 
        bg-white rounded-lg shadow-lg 
        w-full sm:w-4/5 h-full sm:max-h-10/12
        "
      >
        <div className="hidden sm:block fixed top-8 right-8" onClick={onClose}>
          <Image
            src={"/images/close.png"}
            alt="모달닫기"
            width={32}
            height={32}
          />
        </div>
        <div
          className="h-12 p-2 border-b border-b-gray-400 sm:hidden"
          onClick={onClose}
        >
          <Image
            src={"/images/back.png"}
            alt="모달닫기"
            width={32}
            height={32}
          />
        </div>
        <div className="h-full overflow-auto pb-12 sm:overflow-hidden">
          <FeedDetail />
        </div>
      </div>
    </div>
  );
}
