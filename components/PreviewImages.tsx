"use client";

import Image from "next/image";
import { useState, useRef, useEffect, TouchEvent, MouseEvent } from "react";

interface Props {
  images: File[] | string[];
  onRemove?: (index: number) => void;
  isSquare?: boolean;
}

export default function PreviewImages({
  images,
  onRemove,
  isSquare = true,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const goToNextSlide = (): void => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPrevSlide = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleStart = (e: MouseEvent | TouchEvent): void => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMove = (e: MouseEvent | TouchEvent): void => {
    if (!isDragging) return;
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
      setIsDragging(false);
    }
  };

  const handleEnd = (): void => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowRight") {
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        goToPrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, images.length]);

  return (
    <div className="relative mt-2 overflow-hidden bg-gray-100">
      {images.length > 0 ? (
        <>
          <div
            ref={slideRef}
            className="flex w-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            {images.map((file, i) => (
              <div
                key={i}
                className={`relative flex-shrink-0 w-full aspect-square`}
              >
                <Image
                  src={
                    typeof file === "string" ? file : URL.createObjectURL(file)
                  }
                  alt="preview"
                  fill={true}
                  className={`${isSquare ? "object-cover" : "object-contain"}`}
                />
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs rounded px-1 z-10"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>

          {currentIndex > 0 && (
            <Image
              src={"/images/image-btn-left.png"}
              width={24}
              height={24}
              alt="왼쪽이동버튼"
              onClick={goToPrevSlide}
              className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 z-20"
            />
          )}

          {currentIndex < images.length - 1 && (
            <Image
              src={"/images/image-btn-right.png"}
              width={24}
              height={24}
              alt="왼쪽이동버튼"
              onClick={goToNextSlide}
              className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 z-20"
            />
          )}
        </>
      ) : (
        <div className="relative aspect-square rounded bg-gray-100"></div>
      )}
    </div>
  );
}
