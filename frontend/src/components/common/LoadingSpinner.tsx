export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex justify-center items-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <div className="animate-pulse absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-400 opacity-30"></div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border-2 border-blue-400 opacity-30"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
