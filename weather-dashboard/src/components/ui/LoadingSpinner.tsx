export const LoadingSpinner = () => {
  return (
    <div 
      className="flex justify-center items-center"
      data-testid="loading-spinner-container"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};