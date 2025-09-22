import Image from "next/image";

interface FeedHeaderProps {
  nickname: string;
  profileImage: string;
  createdAt?: string;
  category?: string;
}

export default function FeedHeader({
  nickname,
  profileImage,
  createdAt,
  category,
}: FeedHeaderProps) {
  return (
    <header className="flex h-12 gap-4 items-center px-2">
      <div>
        {profileImage && profileImage.length > 0 ? (
          <Image
            src={profileImage}
            alt={nickname}
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
        ) : null}
      </div>

      <p className="flex-1">
        {nickname} <span className="ml-1 mr-2 text-gray-200">•</span>
        {createdAt && (
          <span className="text-gray-400 text-sm">{createdAt}</span>
        )}
      </p>

      {category && (
        <p className="bg-gray-200 text-sm py-1 px-2 rounded-md text-gray-500">
          {category}
        </p>
      )}
    </header>
  );
}
