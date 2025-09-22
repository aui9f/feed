export default function Loading() {
  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-black opacity-20 flex items-center justify-center">
      <div className="flex items-center justify-center py-8">
        <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
