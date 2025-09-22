"use client";

import { FeedForm } from "@/app/feed/create/actions";
import EditableContent from "@/components/EditableContent";
import FeedHeader from "@/components/FeedHeader";
import Button, { variantEnum } from "@/components/forms/Button";
import ImageUploadButton from "@/components/forms/ImageUploadButton";
import PreviewImages from "@/components/PreviewImages";
import { useCategoryList } from "@/hooks/useCategoryList";
import { useLoadingStore } from "@/store/loadingStroe";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function Create() {
  const [state, actions] = useActionState(FeedForm, null);

  const { user } = useUserStore();
  const { setLoading } = useLoadingStore();
  const { data: categoryList, isLoading: categoryIsLoading } =
    useCategoryList();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [content, setContent] = useState("");

  const handleSubmit = async (formData: FormData) => {
    if (selectedCategory === 0) return;
    if (content.replace(/ /gi, "").length === 0) return;
    setLoading(true);
    images.forEach((file) => formData.append("images", file));
    actions(formData);
  };

  const pageBack = () => {
    redirect("/");
  };
  useEffect(() => {
    setLoading(false);
    if (state?.status && state?.status === 200) {
      redirect(`/${state.id}`);
    }
  }, [state, setLoading]);

  if (!user) {
    return null;
  }

  return (
    <section>
      <form action={handleSubmit}>
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
          <h1 className="flex-1 font-bold text-xl text-center">피드 작성</h1>
          <ImageUploadButton images={images} onFilesSelected={setImages} />
          <Button
            type="submit"
            variant={variantEnum.primary}
            disabled={
              selectedCategory === 0 || content.replace(/ /gi, "").length === 0
            }
          >
            공유
          </Button>
        </header>
        <div className="mt-14 flex p-2 gap-4 flex-col sm:flex-row">
          <div className="flex-1 ">
            <PreviewImages
              isSquare={false}
              images={images}
              onRemove={(i) => setImages(images.filter((_, idx) => idx !== i))}
            />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="hidden sm:block">
              <FeedHeader
                nickname={user.nickname}
                profileImage={user.profileImage}
              />
            </div>
            {categoryIsLoading ? (
              <div className="animate-pulse flex flex-col gap-2 border border-gray-200 rounded-md shadow-md">
                <div className="h-10 w-full bg-gray-300 rounded" />
              </div>
            ) : (
              <ul className="flex w-full">
                {categoryList &&
                  categoryList.map((category) => (
                    <li
                      key={category.id}
                      className={`flex-1  text-center p-2 cursor-pointer ${
                        category.id === selectedCategory
                          ? "bg-blue-400 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </li>
                  ))}
              </ul>
            )}

            <div className="flex-1">
              <EditableContent maxLength={280} onInput={setContent} />
            </div>
            <input name="category" type="hidden" value={selectedCategory} />
            <input name="content" type="hidden" value={content} />
          </div>
        </div>
      </form>
    </section>
  );
}
