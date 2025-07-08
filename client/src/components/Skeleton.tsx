
const RippleSkeleton = () => (
  <div className="p-6 bg-white rounded-lg shadow-lg">
    <div className="space-y-4">
      <div className="relative h-4 bg-gray-200 rounded overflow-hidden">
        <div className="absolute inset-0 bg-blue-400 rounded animate-ripple-wave opacity-30"></div>
      </div>

      <div className="flex space-x-4">
        <div className="relative w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ripple-circle opacity-40"></div>
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ripple-circle-2 opacity-30"></div>
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ripple-circle-3 opacity-20"></div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="relative h-3 bg-gray-200 rounded overflow-hidden">
            <div className="absolute inset-0 bg-blue-400 rounded animate-ripple-line opacity-35"></div>
          </div>
          <div className="relative h-3 bg-gray-200 rounded overflow-hidden w-3/4">
            <div className="absolute inset-0 bg-blue-400 rounded animate-ripple-line-2 opacity-35"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RippleSkeleton;
