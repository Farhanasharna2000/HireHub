import React from "react";
import { Clock, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, viewMode }) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl border border-gray-200 
        shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer 
        group overflow-hidden ${viewMode === "list" ? "p-6" : "p-6"}`}
    >
      {/* Background Gradient Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className={viewMode === "list" ? "flex items-start gap-5 relative z-10" : "space-y-4 relative z-10"}>
        {/* Company Logo */}
        <div className={viewMode === "list" ? "flex-shrink-0" : ""}>
          <img
            src={job.logo}
            alt={job.company}
            className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm"
          />
        </div>

        {/* Job Details */}
        <div className={viewMode === "list" ? "flex-1" : ""}>
          <div className={viewMode === "list" ? "flex justify-between items-start" : "space-y-2"}>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>

            {viewMode === "list" && (
              <span className="text-sm text-gray-500 flex-shrink-0">{job.postedDate}</span>
            )}
          </div>

          {/* Job Meta Info */}
          <div
            className={
              viewMode === "list"
                ? "flex items-center flex-wrap gap-x-6 gap-y-2 mt-2"
                : "space-y-2 mt-3"
            }
          >
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-sm">{job.location}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-sm">{job.type}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-sm font-medium">{job.salary}</span>
            </div>
          </div>

          {/* Category + Actions */}
          {viewMode === "grid" && (
            <div className="flex justify-between items-center mt-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {job.category}
              </span>
              <span className="text-sm text-gray-500">{job.postedDate}</span>
            </div>
          )}

          {viewMode === "list" && (
            <div className="flex justify-between items-center mt-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {job.category}
              </span>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                View Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
