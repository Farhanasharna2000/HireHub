'use client'
import React, { useState, useMemo } from "react";
import { Edit, Plus, Search, Trash2, Users, X, ChevronUp, ChevronDown } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";

interface Job {
  id: string;
  title: string;
  company: string;
  status: "Active" | "Closed";
  applicants: number;
}

const DUMMY_JOBS: Job[] = [
  { id: "1", title: "Frontend Developer", company: "ABC Corp", status: "Active", applicants: 12 },
  { id: "2", title: "Backend Engineer", company: "XYZ Ltd", status: "Closed", applicants: 7 },
  { id: "3", title: "Fullstack Developer", company: "TechSoft", status: "Active", applicants: 5 },
  { id: "4", title: "Data Scientist", company: "DataWorks", status: "Closed", applicants: 9 },
  { id: "5", title: "UI/UX Designer", company: "Creative Minds", status: "Active", applicants: 4 },
  { id: "6", title: "Project Manager", company: "Biz Solutions", status: "Active", applicants: 8 },
  { id: "7", title: "DevOps Engineer", company: "CloudTech", status: "Active", applicants: 15 },
  { id: "8", title: "Mobile Developer", company: "AppCraft", status: "Closed", applicants: 6 },
];

export default function JobManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Closed">("All");
  const [sortField, setSortField] = useState<"title" | "status" | "applicants" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const jobsPerPage = 5;

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = DUMMY_JOBS.filter((job) => {
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    if (sortField) {
      filtered = filtered.sort((a, b) => {
        if (sortField === "applicants") {
          return sortOrder === "asc" ? a.applicants - b.applicants : b.applicants - a.applicants;
        } else {
          const aField = a[sortField] as string;
          const bField = b[sortField] as string;
          if (aField < bField) return sortOrder === "asc" ? -1 : 1;
          if (aField > bField) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    return filtered;
  }, [searchTerm, statusFilter, sortField, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedJobs.length / jobsPerPage);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * jobsPerPage;
    return filteredAndSortedJobs.slice(start, start + jobsPerPage);
  }, [filteredAndSortedJobs, page]);

  // Handlers
  const handleSort = (field: "title" | "status" | "applicants") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = (jobId: string) => {
    alert(`Change status for job id: ${jobId}`);
  };

  const handleDeleteJob = (jobId: string) => {
    alert(`Delete job id: ${jobId}`);
  };

  const goToPrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const SortIcon: React.FC<{ field: string }> = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortOrder === "asc" ? 
      <ChevronUp className="w-4 h-4 text-blue-600" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
        <DashboardLayout activeMenu="manage-jobs">

      <div className="container mx-auto p-8">
        {/* Glassmorphism Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Job Management
              </h1>
              <p className="text-slate-600 text-lg">Manage your job postings and track applications</p>
            </div>
            <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add New Job
            </button>
          </div>

          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | "Active" | "Closed")}
              className="px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-3 rounded-2xl border border-emerald-200">
              <p className="text-slate-700 font-medium">
                Showing {paginatedJobs.length} of {filteredAndSortedJobs.length} jobs
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {filteredAndSortedJobs.length === 0 && !isLoading ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Jobs Found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <div className="grid grid-cols-12 gap-4 px-8 py-6">
                  <div 
                    className="col-span-4 cursor-pointer group flex items-center gap-2 hover:text-blue-600 transition-colors duration-300"
                    onClick={() => handleSort("title")}
                  >
                    <span className="font-semibold text-slate-700 group-hover:text-blue-600">Job Title</span>
                    <SortIcon field="title" />
                  </div>
                  <div 
                    className="col-span-2 cursor-pointer group flex items-center gap-2 hover:text-blue-600 transition-colors duration-300"
                    onClick={() => handleSort("status")}
                  >
                    <span className="font-semibold text-slate-700 group-hover:text-blue-600">Status</span>
                    <SortIcon field="status" />
                  </div>
                  <div 
                    className="col-span-2 cursor-pointer group flex items-center gap-2 hover:text-blue-600 transition-colors duration-300"
                    onClick={() => handleSort("applicants")}
                  >
                    <span className="font-semibold text-slate-700 group-hover:text-blue-600">Applicants</span>
                    <SortIcon field="applicants" />
                  </div>
                  <div className="col-span-4 font-semibold text-slate-700">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-100">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="px-8 py-6">
                        <div className="animate-pulse">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  : paginatedJobs.map((job, index) => (
                      <div 
                        key={job.id} 
                        className="grid grid-cols-12 gap-4 px-8 py-6 hover:bg-blue-50/50 transition-all duration-300 group"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        <div className="col-span-4">
                          <div className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                            {job.title}
                          </div>
                          <div className="text-slate-500 text-sm">{job.company}</div>
                        </div>
                        <div className="col-span-2">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === "Active" 
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                              : "bg-slate-100 text-slate-800 border border-slate-200"
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-300">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{job.applicants}</span>
                          </button>
                        </div>
                        <div className="col-span-4 flex items-center gap-3">
                          <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110">
                            <Edit className="w-4 h-4" />
                          </button>
                          {job.status === "Active" ? (
                            <button 
                              onClick={() => handleStatusChange(job.id)}
                              className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-300 text-sm font-medium"
                            >
                              <X className="w-4 h-4" />
                              Close
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusChange(job.id)}
                              className="flex items-center gap-2 px-3 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-300 text-sm font-medium"
                            >
                              <Plus className="w-4 h-4" />
                              Activate
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteJob(job.id)}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-t border-slate-200">
                  <div className="flex justify-center items-center gap-4">
                    <button 
                      onClick={goToPrevPage} 
                      disabled={page === 1}
                      className="px-4 py-2 text-slate-600 border border-slate-300 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                              page === pageNumber
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-slate-600 hover:bg-white hover:shadow-md"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={goToNextPage} 
                      disabled={page === totalPages}
                      className="px-4 py-2 text-slate-600 border border-slate-300 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none"
                    >
                      Next
                    </button>
                  </div>
                  
                  <div className="text-center mt-4 text-slate-500 text-sm">
                    Page {page} of {totalPages}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
        </DashboardLayout>
  );
}