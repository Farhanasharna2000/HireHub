'use client' 
import React, { useState, useMemo } from "react";
import { Edit, Plus, Search, Trash2, Users, X, ChevronUp, ChevronDown } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 
import { useGetCompanyJobsQuery,useDeleteJobMutation,useUpdateJobStatusMutation } from "@/redux/jobs/jobsApi"; 
import toast from "react-hot-toast";

interface Job {
  _id?: string;
  id?: string;
  title: string;          
  companyName: string;
  status: "Active" | "Closed" ; 
  applicants: number;
  location?: string;
  category?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function JobManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Closed">("All");
  const [sortField, setSortField] = useState<"title" | "status" | "applicants" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState<number>(1);
  const jobsPerPage = 5;

  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.user);

  // Fetch jobs for the logged-in recruiter's company
  const { 
    data: jobsData, 
    isLoading, 
    error,
    refetch 
  } = useGetCompanyJobsQuery(user.companyName, {
    skip: !user.companyName || user.role !== 'recruiter'
  });
const [updateJobStatus, { isLoading: updatingStatus }] = useUpdateJobStatusMutation();
  const [deleteJob, { isLoading: deletingJob }] = useDeleteJobMutation();

  // Transform the jobs data to match our interface
  const jobs: Job[] = useMemo(() => {
    if (!jobsData?.jobs) return [];

    return jobsData.jobs.map((job: Job) => ({
      id: job._id || job.id,
      title: job.jobTitle || "",
      companyName: job.companyName || "",
      status: job.status || "Active",  
      applicants: job.applicants || 0,
      location: job.location,
      category: job.category,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));
  }, [jobsData]);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    if (!jobs.length) return [];

    let filtered = jobs.filter((job) => {
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    if (sortField) {
      filtered = filtered.sort((a, b) => {
        if (sortField === "applicants") {
          return sortOrder === "asc" ? a.applicants - b.applicants : b.applicants - a.applicants;
        } else {
          const aField = (a[sortField] || "").toString().toLowerCase();
          const bField = (b[sortField] || "").toString().toLowerCase();
          if (aField < bField) return sortOrder === "asc" ? -1 : 1;
          if (aField > bField) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortOrder]);

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

const handleStatusChange = async (jobId: string) => {
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return;

  const newStatus = job.status === "Active" ? "Closed" : "Active";

  try {
    await updateJobStatus({ id: jobId, status: newStatus }).unwrap();
    refetch();
   toast.success(`Job status changed to ${newStatus}`);
  } catch (err) {
    console.error("Error updating job status:", err);
   toast.error("Failed to update job status");
  }
};

const handleDeleteJob = async (jobId: string) => {
  try {
    // Make sure we're using the correct ID (the _id from MongoDB)
    await deleteJob(jobId).unwrap();
    refetch();
    toast.success("Job deleted successfully");
  } catch (err) {
    console.error("Error deleting job:", err);
    toast.error("Failed to delete job");
  }
};

  const goToPrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const SortIcon: React.FC<{ field: string }> = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortOrder === "asc" ? 
      <ChevronUp className="w-4 h-4 text-blue-600" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  if (error) {
    return (
      <DashboardLayout activeMenu="manage-jobs">
        <div className="container mx-auto p-8">
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Jobs</h3>
            <p className="text-slate-500 mb-4">Failed to load jobs. Please try again.</p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold  pb-2">
                Job Management
              </h1>
            
            </div>
            <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add New Job
            </button>
          </div>

          {/* Filters */}
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

        {/* Jobs Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {filteredAndSortedJobs.length === 0 && !isLoading ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">
                {jobs.length === 0 ? 'No Jobs Posted Yet' : 'No Jobs Found'}
              </h3>
              <p className="text-slate-500">
                {jobs.length === 0 
                  ? 'Start by creating your first job posting' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
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
                          {job.location && (
                            <div className="text-sm text-slate-500">{job.location}</div>
                          )}
                        </div>
                        <div className="col-span-2">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === "Active" 
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                              : "bg-slate-100 text-slate-800 border border-slate-200"
                          }`}>
                            {job.status || "Active"}
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

              {/* Pagination */}
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
