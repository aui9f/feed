"use client";

import Image from "next/image";
import React from "react";

interface Props {
  images: File[];
  onFilesSelected: (files: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}
export default function ImageUploadButton({
  images = [],
  onFilesSelected,
  maxImages = 4,
  maxSizeMB = 10,
}: Props) {
  const handleFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    if (images.length + files.length > maxImages) {
      alert(`이미지는 최대 ${maxImages}장까지 업로드할 수 있습니다.`);
      return;
    }

    const fileArray = Array.from(files);
    const processedFiles: File[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      if (file.size / 1024 / 1024 > maxSizeMB) {
        alert(`${file.name} 파일이 ${maxSizeMB}MB를 초과했습니다.`);
        continue;
      }
      processedFiles.push(file);
    }

    // 기존 이미지를 포함하여 새로운 파일 목록을 생성
    onFilesSelected([...images, ...processedFiles]);
  };

  return (
    <div className="p-2 m-1 hover:bg-blue-200 hover:rounded-md cursor-pointer">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
        id="imageUpload"
      />
      <label htmlFor="imageUpload">
        <Image
          src="/images/image-btn-add.png"
          alt="이미지추가"
          width={24}
          height={24}
        />
      </label>
    </div>
  );
}
