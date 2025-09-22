"use client";

import Link from "next/link";
import { URL_REGEX, TAG_REGEX } from "@/lib/regex";

export function highlightText(txt: string) {
  if (!txt) return <p></p>;
  const parts = txt.split(/(\s+)/);
  return (
    <p>
      {parts.map((part, idx) => {
        if (URL_REGEX.test(part)) {
          return (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {part}
            </a>
          );
        }

        if (TAG_REGEX.test(part)) {
          const tag = part.replace("#", "");
          return (
            <Link
              key={idx}
              href={`/feed/search?tag=${tag}`}
              className="text-blue-400"
            >
              {part}
            </Link>
          );
        }

        return <span key={idx}>{part}</span>;
      })}
    </p>
  );
}
