"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");
  const pageBack = () => {
    redirect("/");
  };

  return (
    <section>
      <header className="z-40 bg-white fixed top-0 left-0 right-0 flex h-14 px-2 items-center mb-2 border-b border-b-gray-400">
        <div>
          <Image
            src={"/images/back.png"}
            alt="뒤로가기"
            width={24}
            height={24}
            onClick={pageBack}
          />
        </div>
        <h2 className="flex-1 font-bold text-xl text-center">
          {tag ? <p>#{tag}</p> : <p>태그가 없습니다.</p>}
        </h2>
      </header>
      <ul className="grid grid-cols-3 gap-2 p-2 mt-14">
        {Array.from({ length: 30 }).map((_, idx) => (
          <li key={idx} className="bg-gray-100 rounded-md aspect-square"></li>
        ))}
      </ul>
    </section>
  );
}
