"use client";

import FeedDetail from "@/components/intercept/FeedDetail";
import { useModalStore } from "@/store/modalStore";
import Image from "next/image";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DetailModal() {
  const params = useParams();
  const router = useRouter(); // useRouter 훅 사용
  const { setModal } = useModalStore();
  const id = params.id;
  const onClose = () => {
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
      <div className="w-4/5 max-h-10/12 overflow-hidden bg-white rounded-lg shadow-lg ">
        <div className="fixed top-8 right-8" onClick={onClose}>
          <Image
            src={"/images/close.png"}
            alt="모달닫기"
            width={32}
            height={32}
          />
        </div>
        <FeedDetail />
      </div>
    </div>
  );
}
