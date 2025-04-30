const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  USERS_PER_PAGE,
}) => {
  // Check if the device is mobile (screen width <= 640px)
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;

  // Function to generate an array of page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    pages.push(1); // Always show the first page

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if the range starts after the second page
    if (rangeStart > 2) pages.push("...");

    // Add page numbers between rangeStart and rangeEnd
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis if the range ends before the last page
    if (rangeEnd < totalPages - 1) pages.push("...");

    // Always show the last page if more than 1 page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  // Do not render pagination if there is only 1 page
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 w-full">
      {/* Display current items range */}
      <div className="text-sm text-gray-500 mb-4 sm:mb-0">
        Showing {Math.min(totalItems, 1 + (currentPage - 1) * USERS_PER_PAGE)} -
        {Math.min(currentPage * USERS_PER_PAGE, totalItems)} of {totalItems}{" "}
        users
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          ←
        </button>

        {/* Page numbers - hidden on mobile */}
        {!isMobile &&
          getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 rounded border text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ) : (
              // Ellipsis
              <span key={index} className="px-2 text-gray-500">
                {page}
              </span>
            )
          )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
