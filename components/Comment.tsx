import { formatDate } from "@/utils/formatDate";
import Image from "next/image";

export default function Comment({ content, createdAt, author }) {
  return (
    <li className="flex gap-2 my-2">
      <div>
        <Image
          src={author.profileImage}
          alt={author.nickname}
          width={24}
          height={24}
          className="rounded-full mt-2"
        />
      </div>
      <div className="flex-1">
        <p>
          <span className="font-bold">{author.nickname}</span>{" "}
          <span className=" text-gray-600">{content}</span>
        </p>

        <div>
          <p className="text-sm  text-gray-500">
            {formatDate(new Date(createdAt))}
          </p>
        </div>
      </div>
    </li>
  );
}
