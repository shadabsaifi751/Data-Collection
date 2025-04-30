import debounce from "lodash.debounce";
import { useCallback, useState } from "react";

const FilterBar = ({ filters, setFilters, data }) => {
  // Local state for search input value
  const [searchText, setSearchText] = useState(filters.search || "");

  // Debounced search function to avoid calling setFilters too frequently
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters({ ...filters, search: value });
    }, 400),
    []
  );

  // Generic handler for select inputs (city, country, gender)
  const handleChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // Handle text input change for search with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value); // Update local state
    debouncedSearch(value); // Trigger debounced filter update
  };

  // Helper function to get unique values for dropdowns
  const uniqueValues = (field) => {
    const values = data.map((user) => user[field]).filter(Boolean); // Remove undefined/null
    return Array.from(new Set(values)); // Return unique values
  };

  const cities = uniqueValues("city");
  const countries = uniqueValues("country");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchText}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* City Filter Dropdown */}
        <div>
          <select
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter Dropdown */}
        <div>
          <select
            value={filters.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter Dropdown */}
        <div>
          <select
            value={filters.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
