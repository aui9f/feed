"use client";
import { useRef, useState } from "react";

interface IEditableContentProps {
  onInput: (value: string) => void;
  maxLength?: number;
  height?: number; // 부모가 전달하는 높이
}

export default function EditableContent({
  onInput,
  maxLength = 280,
  height = 240,
}: IEditableContentProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onInput(e.target.value);
  };

  return (
    <div className="relative w-full">
      {/* 하이라이트된 텍스트 레이어 */}
      <div
        className="absolute top-0 left-0 w-full p-2 whitespace-pre-wrap overflow-hidden"
        style={{ height }}
        dangerouslySetInnerHTML={{
          __html: content.replace(
            /([#@$][\w_가-힣]+)/g,
            '<span class="text-blue-400">$1</span>'
          ),
        }}
      />

      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        className="relative w-full p-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
        text-transparent  caret-gray-950"
        style={{
          height,
        }}
        maxLength={maxLength}
      />
      <p
        className={`text-right ${
          content.length >= maxLength ? "text-red-400" : "text-gray-400"
        }`}
      >
        {content.length}/{maxLength}
      </p>
    </div>
  );
}
