"use client";

import React, { useState } from "react";
import {
  Filter,
  Grid,
  List,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobseeker/JobCard";
import SearchHeader from "@/components/jobseeker/SearchHeader";
import { CATEGORIES, JOB_TYPES } from "@/constants/features";
import { useRouter } from "next/navigation";
import { mockJobs } from "@/constants/jobs";
import HomeLayout from "@/layouts/HomeLayout";

// ------------------ Types ------------------
interface Filters {
  keywords: string;
  location: string;
  category: string;
  type: string;
  minSalary: string;
  maxSalary: string;
}

interface ExpandedSections {
  jobType: boolean;
  salary: boolean;
  categories: boolean;
}

interface FilterContentProps {
  toggleSection: (section: keyof ExpandedSections) => void;
  clearAllFilters: () => void;
  expandedSections: ExpandedSections;
  handleFilterChange: (field: keyof Filters, value: string) => void;
  filters: Filters;
}


// ------------------ FilterContent Component ------------------

const FilterContent: React.FC<FilterContentProps> = ({
  toggleSection,
  clearAllFilters,
  expandedSections,
  handleFilterChange,
  filters,
}) => (
  <div className="space-y-6">
    {/* Clear Filters */}
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="text-blue-600 hover:text-blue-700"
      >
        Clear All
      </Button>
    </div>

    {/* Categories */}
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection("categories")}
        className="flex justify-between items-center w-full py-2 text-left"
      >
        <span className="font-medium text-gray-900">Categories</span>
        {expandedSections.categories ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections.categories && (
        <div className="mt-3 space-y-2">
          {CATEGORIES.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.category === category.value}
                onChange={(e) =>
                  handleFilterChange(
                    "category",
                    e.target.checked ? category.value : ""
                  )
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Job Type */}
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection("jobType")}
        className="flex justify-between items-center w-full py-2 text-left"
      >
        <span className="font-medium text-gray-900">Job Type</span>
        {expandedSections.jobType ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections.jobType && (
        <div className="mt-3 space-y-2">
          {JOB_TYPES.map((type) => (
            <label key={type.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.type === type.value}
                onChange={(e) =>
                  handleFilterChange("type", e.target.checked ? type.value : "")
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Salary Range */}
    <div>
      <button
        onClick={() => toggleSection("salary")}
        className="flex justify-between items-center w-full py-2 text-left"
      >
        <span className="font-medium text-gray-900">Salary Range</span>
        {expandedSections.salary ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections.salary && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum
            </label>
            <Input
              type="number"
              placeholder="$0"
              value={filters.minSalary}
              onChange={(e) => handleFilterChange("minSalary", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum
            </label>
            <Input
              type="number"
              placeholder="$200,000"
              value={filters.maxSalary}
              onChange={(e) => handleFilterChange("maxSalary", e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

// ------------------ Main Dashboard Component ------------------

const JobSeekerDashboard: React.FC = () => {
  const router=useRouter()
  const [jobs] = useState(mockJobs);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    keywords: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  });

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    jobType: true,
    salary: true,
    categories: true,
  });

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      keywords: "",
      location: "",
      category: "",
      type: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  const MobileFilterOverlay: React.FC = () => {
    if (!showMobileFilter) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowMobileFilter(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>

          <h2 className="text-xl font-semibold mb-6 pr-8">Filter Jobs</h2>

          <FilterContent
            toggleSection={toggleSection}
            clearAllFilters={clearAllFilters}
            expandedSections={expandedSections}
            handleFilterChange={handleFilterChange}
            filters={filters}
          />

          <div className="mt-6 pt-4 border-t">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowMobileFilter(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <HomeLayout>
    <div className="bg-gray-50">
      <SearchHeader filters={filters} handleFilterChange={handleFilterChange} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <FilterContent
                toggleSection={toggleSection}
                clearAllFilters={clearAllFilters}
                expandedSections={expandedSections}
                handleFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-lg text-gray-900">
                  Showing{" "}
                  <span className="font-semibold text-blue-600">
                    {jobs.length}
                  </span>{" "}
                  Jobs
                </p>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setShowMobileFilter(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-200 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Grid/List */}
            {jobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    viewMode={viewMode}
                    onClick={() => router.push(`/find-jobs/${job.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileFilterOverlay />
    </div>
    </HomeLayout>
    </>
  );
};

export default JobSeekerDashboard;
