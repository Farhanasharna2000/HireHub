import React from "react";
import { Clock } from "lucide-react";

interface Applicant {
  name: string;
  // add other applicant properties if needed
}

interface ApplicantDashboardCardProps {
  applicant: Applicant;
  position: string;
  time: string;
}

const ApplicantDashboardCard: React.FC<ApplicantDashboardCardProps> = ({
  applicant,
  position,
  time,
}) => {
  // Safety check in case name is empty or malformed
  const initials = applicant.name
    ? applicant.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-lg text-gray-700">
          {initials}
        </div>
        <div>
          <h4 className="font-semibold">{applicant.name}</h4>
          <p className="text-sm text-gray-500">{position}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <Clock className="w-4 h-4" />
        <span>{time}</span>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
