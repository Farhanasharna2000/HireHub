'use client'
import React from "react";
import { Clock, DollarSign, MapPin, Bookmark } from "lucide-react";
import Image from "next/image";
import { Job } from "@/types/job";
import { useToggleSavedJobMutation } from "@/redux/jobs/jobsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface JobCardProps {
  job: Job;
  onClick: () => void;
  viewMode: "list" | "grid";
  onBookmark?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, viewMode }) => {
  const [toggleSavedJob] = useToggleSavedJobMutation();
  const user = useSelector((state: RootState) => state.user);

  //  Make sure user.email is string before using it
  const isSaved =
    user.email !== null ? job.savedUsers?.includes(user.email) : false;

  // Handle null logo
  const logoSrc =
    job.companyLogo ||
    "https://img.icons8.com/?size=100&id=98957&format=png&color=000000";

  // Format salary
  const salary =
    job.salaryMin && job.salaryMax
      ? `$${job.salaryMin} - $${job.salaryMax}`
      : "Not specified";

  // Helper to format relative time
  const timeAgo = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "Unknown";

    const postedDate =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diff = Math.floor((now.getTime() - postedDate.getTime()) / 1000);

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800)
      return `${Math.floor(diff / 86400)} day${
        Math.floor(diff / 86400) > 1 ? "s" : ""
      } ago`;

    return postedDate.toLocaleDateString();
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!user.email) return; // ✅ ensures email is not null
      await toggleSavedJob({ id: job._id, userEmail: user.email }).unwrap();
    } catch (err) {
      console.error("Failed to toggle saved job", err);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl border border-gray-200 
        shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer 
        group overflow-hidden ${viewMode === "list" ? "p-5" : "p-6"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {user.role === "job_seeker" && (
        <button
          onClick={handleBookmark}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white shadow hover:bg-blue-50 transition"
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isSaved ? "text-blue-600 fill-blue-600" : "text-gray-500"
            }`}
          />
        </button>
      )}

      <div
        className={
          viewMode === "list"
            ? "flex items-center gap-5 relative z-10"
            : "space-y-4 relative z-10"
        }
      >
        <Image
          src={logoSrc}
          alt={job.companyName || "Company Logo"}
          width={100}
          height={100}
          className="w-16 h-16 rounded-xl object-contain border border-gray-100 shadow-sm flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div
            className={`flex ${
              viewMode === "list"
                ? "justify-between items-start"
                : "flex-col gap-1"
            }`}
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {job.jobTitle}
              </h3>
              <p className="text-gray-600 font-medium">{job.companyName}</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 mt-3">
            <div className="flex items-center px-3 py-1 bg-slate-100 text-slate-800 rounded-full">
              <MapPin className="w-4 h-4 mr-1 text-slate-800" />
              <span className="text-xs font-medium">{job.location}</span>
            </div>

            <div className="flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              <Clock className="w-4 h-4 mr-1 text-emerald-800" />
              <span className="text-xs font-medium">{job.jobType}</span>
            </div>

            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {job.category}
            </span>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-sm font-medium">{salary}</span>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
              {timeAgo(job?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
