import { useEffect, useState } from "react";
import useSWR from "swr";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import UserCard from "@/components/UserCard";

export default function Home() {
  // State for storing unfiltered user data for filter dropdowns
  const [filterData, setFilterData] = useState([]);
  // Filters applied by user (gender, city, country, search)
  const [filters, setFilters] = useState({
    gender: "",
    city: "",
    country: "",
    search: "",
    page: 1,
  });
  // Track current pagination page
  const [currentPage, setCurrentPage] = useState(1);
  // Show loader until data is fetched
  const [isUserLoading, setIsUserLoading] = useState(true);

  const USERS_PER_PAGE = 10;

  // Build query string based on filters and current page
  const buildQueryString = () => {
    const params = new URLSearchParams({
      gender: filters.gender,
      city: filters.city,
      country: filters.country,
      search: filters.search || "",
      page: currentPage.toString(),
    });
    return params.toString();
  };

  // Custom fetcher for useSWR
  const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  };

  // Initial fetch for filter bar dropdown data
  const fetchUsersData = async () => {
    try {
      setIsUserLoading(true);
      const res = await fetch(`/api/users`);
      const data = await res.json();
      setFilterData(data.results || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsUserLoading(false);
    }
  };

  // Trigger cron job & fetch base user data on mount
  useEffect(() => {
    fetch("/api/cron"); // Optionally triggers cron logic
    fetchUsersData(); // Gets user data for filters
  }, []);

  // SWR to fetch user list based on current filters
  const { data, error, isValidating } = useSWR(
    `/api/users?${buildQueryString()}`,
    fetcher,
    {
      onSuccess: (data) => {
        // Show log message if filtered results found
        if (
          filters.city ||
          filters.country ||
          filters.gender ||
          filters.search
        ) {
          console.log(`${data.totalUsers || data.results?.length} users found`);
        }
      },
      onError: (error) => {
        console.error("Error fetching users:", error);
      },
    }
  );

  // SWR response destructuring
  const users = data?.results || [];
  const totalUsers = data?.totalUser || 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE) || 1;
  const isLoading = !data && !error;

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update filters and reset page to 1
  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Directory</h1>
          <p className="text-gray-600 mt-2">
            Browse, search and filter through our user database
            {isValidating && !isLoading && (
              <span className="inline-block ml-2 text-xs text-blue-500">
                (Refreshing...)
              </span>
            )}
          </p>
        </div>

        {/* Filter Bar Component */}
        <FilterBar
          filters={filters}
          data={filterData}
          setFilters={handleFilterChange}
        />

        {/* Conditional UI rendering */}
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 animate-pulse h-40 rounded-lg"
              ></div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Error loading users
            </h3>
            <p className="mt-1 text-gray-500">Please try again later.</p>
          </div>
        ) : users.length > 0 ? (
          <>
            {/* Render list of users */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalUsers}
              onPageChange={handlePageChange}
              USERS_PER_PAGE={USERS_PER_PAGE}
            />
          </>
        ) : (
          // No users found state
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
