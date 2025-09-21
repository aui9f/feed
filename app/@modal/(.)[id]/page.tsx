"use client";

import FeedDetail from "@/components/intercept/FeedDetail";
import { useParams } from "next/navigation";

export default function DetailModal() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="fixed inset-0 z-50 top-0 bottom-0 flex items-center justify-center bg-black/60">
      <div className="w-4/5 overflow-hidden bg-white rounded-lg shadow-lg ">
        <FeedDetail />
      </div>
    </div>
  );
}
