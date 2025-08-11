import React from "react";
import { Input } from "../ui/input";
import { MapPin, Search } from "lucide-react";
import { Button } from "../ui/button";

interface Filters {
  keywords: string;
  location: string;
}

interface SearchHeaderProps {
  filters: Filters;
  handleFilterChange: (field: keyof Filters, value: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ filters, handleFilterChange }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
      <div>
        <div className="text-center mb-12 px-2 sm:px-0">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-none">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover opportunities that match your passion and unlock your potential
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col lg:flex-row gap-4 items-end"
        >
          {/* Keywords input */}
          <div className="flex-1 relative group w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="text"
                placeholder="Job title, Company or Keywords"
                value={filters.keywords}
                onChange={(e) => handleFilterChange("keywords", e.target.value)}
                className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200 w-full"
              />
            </div>
          </div>

          {/* Location input */}
          <div className="flex-1 relative group w-full">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200 w-full"
              />
            </div>
          </div>

          {/* Search button */}
          <div className="w-full lg:w-auto">
            <Button
              size="lg"
              type="submit"
              className="w-full lg:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Jobs
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchHeader;
