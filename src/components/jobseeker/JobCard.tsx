import React from "react";
import { Clock, DollarSign, MapPin, Bookmark } from "lucide-react";
import Image from "next/image";

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  postedDate: string;
}

interface JobCardProps {
  job: Job;
  onClick: () => void;
  viewMode: "list" | "grid";
  onBookmark?: (jobId: string) => void; // Optional bookmark handler
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  viewMode,
  onBookmark,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl border border-gray-200 
        shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer 
        group overflow-hidden ${viewMode === "list" ? "p-5" : "p-6"}`}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Bookmark Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering card click
          onBookmark?.(job.id);
        }}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white shadow hover:bg-blue-50 transition"
      >
        <Bookmark className="w-5 h-5 text-gray-500 hover:text-blue-600 transition-colors" />
      </button>

      <div
        className={
          viewMode === "list"
            ? "flex items-center gap-5 relative z-10"
            : "space-y-4 relative z-10"
        }
      >
        {/* Company Logo */}
        <Image
          src={job.logo}
          alt={job.company}
          width={100}
          height={100}
          className="w-16 h-16 rounded-xl object-contain border border-gray-100 shadow-sm flex-shrink-0"
        />

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          {/* Title + Company + Date */}
          <div
            className={`flex ${
              viewMode === "list" ? "justify-between items-start" : "flex-col gap-1"
            }`}
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
        
          </div>

          {/* Meta Info */}
          <div className="flex items-center flex-wrap gap-2 mt-3">
            <div className="flex items-center px-3 py-1 bg-slate-100 text-slate-800 rounded-full">
              <MapPin className="w-4 h-4 mr-1 text-slate-800" />
              <span className="text-xs font-medium">{job.location}</span>
            </div>

            <div className="flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              <Clock className="w-4 h-4 mr-1 text-emerald-800" />
              <span className="text-xs font-medium">{job.type}</span>
            </div>

            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {job.category}
            </span>
          </div>

          {/* Footer Actions */}
          {viewMode === "grid" && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-sm font-medium">{job.salary}</span>
              </div>
              <span className="text-sm text-gray-500">{job.postedDate}</span>
            </div>
          )}

          {viewMode === "list" && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-sm font-medium">{job.salary}</span>
              </div>
                  {viewMode === "list" && (
              <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                {job.postedDate}
              </span>
            )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default JobCard;
