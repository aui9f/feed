export default function FeedSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-2 p-4 border border-gray-200 rounded-md shadow-md">
      <div className="h-12 w-full bg-gray-300 rounded" />
      <div className="w-full aspect-square bg-gray-300 rounded" />
      <div className="h-20 w-full bg-gray-300 rounded" />
    </div>
  );
}
