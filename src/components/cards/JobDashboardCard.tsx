import { Briefcase } from "lucide-react";
import React from "react";

interface Job {
  title: string;
  location: string;
  createdAt: string;
  isClosed?: boolean;  // optional now
}

interface JobDashboardCardProps {
  job: Job;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
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
          <h4 className="font-semibold">{job.title}</h4>
          <p className="text-sm text-gray-500">
            {job.location} • {formatDate(job.createdAt)}
          </p>
        </div>
      </div>
      <div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            !job.isClosed
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {job.isClosed ? "Closed" : "Active"}
        </span>
      </div>
    </div>
  );
};

export default JobDashboardCard;
