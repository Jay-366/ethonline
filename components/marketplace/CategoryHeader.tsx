import React from "react";
import Link from "next/link";

/*
 * CategoryHeader component
 *
 * This component renders a header section for an AI Agents category page, inspired by
 * the provided design. It includes breadcrumbs, a title, a subtitle, a search bar,
 * and filter buttons for ratings, price, categories and sorting. The colour
 * palette strictly adheres to #161823, #f8ede0, and #5d606c.
 */

interface CategoryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onFiltersChange: (filters: {
    category: string;
    priceRange: [number, number];
    rating: number;
  }) => void;
  activeFilters: {
    category: string;
    priceRange: [number, number];
    rating: number;
  };
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onFiltersChange,
  activeFilters,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = React.useState(false);

  const categories = ['All', 'Customer Service', 'Development', 'Workflow', 'Voice', 'Content', 'Analytics', 'Security'];
  const ratings = [
    { label: 'All Ratings', value: 0 },
    { label: '4+ Stars', value: 4 },
    { label: '4.5+ Stars', value: 4.5 },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-6 pt-24 pb-4 bg-gradient-to-r from-[#161823] to-[#161823] text-[#f8ede0]">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-[#5d606c]">
        <Link href="/" className="hover:underline cursor-pointer">Home</Link> <span className="mx-1">&gt;</span> <span>Marketplace</span>
      </nav>

      {/* Title and subtitle */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Agents Listed</h1>
      <p className="text-base md:text-lg text-[#5d606c] mb-6">Browse AI Agents by category</p>

      {/* Search bar and filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search input */}
        <div className="flex flex-grow items-center rounded-md border border-[#5d606c] bg-transparent px-3 py-2 h-[38px] focus-within:border-[#f8ede0]">
          {/* Search icon as SVG */}
          <svg
            className="h-5 w-5 text-[#5d606c] mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-grow bg-transparent outline-none text-[#f8ede0] placeholder-[#5d606c]"
          />
        </div>

        {/* Filter buttons */}
        <div className="relative">
          <button
            onClick={() => setShowRatingDropdown(!showRatingDropdown)}
            className="flex items-center gap-1 rounded-md border border-[#5d606c] px-3 py-2 h-[38px] text-sm text-[#f8ede0] hover:bg-[#5d606c] hover:text-[#161823] transition"
          >
            Ratings
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showRatingDropdown && (
            <div className="absolute top-full mt-2 w-48 bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-10">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => {
                    onFiltersChange({ ...activeFilters, rating: rating.value });
                    setShowRatingDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#f8ede0] hover:bg-[#5d606c] transition"
                >
                  {rating.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-1 rounded-md border border-[#5d606c] px-3 py-2 h-[38px] text-sm text-[#f8ede0] hover:bg-[#5d606c] hover:text-[#161823] transition"
          >
            Categories
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full mt-2 w-48 bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onFiltersChange({ 
                      ...activeFilters, 
                      category: category === 'All' ? '' : category 
                    });
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#f8ede0] hover:bg-[#5d606c] transition"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="flex items-center gap-1 rounded-md border border-[#5d606c] px-3 py-2 h-[38px] text-sm text-[#f8ede0] hover:bg-[#5d606c] hover:text-[#161823] transition"
        >
          Sort by
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
};
