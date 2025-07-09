const RippleSkeleton = () => (
  <div className="skeleton-container">
    <div className="skeleton-space-y-6">
      <div className="skeleton-line-base">
        <div className="absolute inset-0 bg-blue-400 animate-ripple-wave opacity-30"></div>
      </div>
      <div className="skeleton-chart-area">
        <div className="skeleton-chart-bars">
          <div className="skeleton-bar skeleton-bar-w-1-6 skeleton-bar-h-3-4">
            <div className="absolute inset-0 bg-green-500 animate-ripple-bar opacity-30"></div>
          </div>
          <div className="skeleton-bar skeleton-bar-w-1-6 skeleton-bar-h-1-2">
            <div className="absolute inset-0 bg-red-600 animate-ripple-bar-2 opacity-30"></div>
          </div>
          <div className="skeleton-bar skeleton-bar-w-1-6 skeleton-bar-h-5-6">
            <div className="absolute inset-0 bg-blue-400 animate-ripple-bar opacity-30"></div>
          </div>
          <div className="skeleton-bar skeleton-bar-w-1-6 skeleton-bar-h-2-3">
            <div className="absolute inset-0 bg-blue-600 animate-ripple-bar-2 opacity-30"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-blue-400 animate-ripple-chart opacity-15"></div>
      </div>
      <div className="skeleton-flex-1 skeleton-space-y-3">
        <div className="skeleton-text-line">
          <div className="absolute inset-0 bg-blue-400 rounded animate-ripple-line opacity-35"></div>
        </div>
        <div className="skeleton-text-line skeleton-text-line-w-3-4">
          <div className="absolute inset-0 bg-blue-400 rounded animate-ripple-line-2 opacity-35"></div>
        </div>
      </div>
    </div>
  </div>
);

export default RippleSkeleton;
