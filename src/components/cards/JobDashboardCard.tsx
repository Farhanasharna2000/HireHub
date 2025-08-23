import { Job } from "@/types/job";
import { Briefcase } from "lucide-react";
import React from "react";

interface JobDashboardCardProps {
  job: Job;
}

function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return "N/A"; // fallback if it's undefined

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const JobDashboardCard: React.FC<JobDashboardCardProps> = ({ job }) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-full">
          <Briefcase className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h4 className="font-semibold">{job.jobTitle}</h4>
          <p className="text-sm text-gray-500">
            {job.location} • {formatDate(job.createdAt)}
          </p>
        </div>
      </div>
      <div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            job.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {job.status}
        </span>
      </div>
    </div>
  );
};

export default JobDashboardCard;
