import React from "react";
import {
  Clock,
  MapPin,
  DollarSign,
  Edit3,
  Users,
  Star,
} from "lucide-react";

interface JobPostingPreviewProps {
  jobTitle: string;
  location: string;
  category: string;
  jobType: string;
  description: string;
  requirements: string;
  salaryMin?: string;
  salaryMax?: string;
  onEdit: () => void;
}

const JobPostingPreview: React.FC<JobPostingPreviewProps> = ({
  jobTitle,
  location,
  category,
  jobType,
  description,
  requirements,
  salaryMin,
  salaryMax,
  onEdit,
}) => {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto ">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Top gradient bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          {/* Header content */}
          <div className="md:p-8 p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="md:text-2xl text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Job Preview
              </h2>

              <button
                onClick={onEdit}
                className="group bg-gradient-to-r from-gray-100 to-gray-50 hover:from-blue-50 hover:to-purple-50 px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 border border-gray-200 hover:border-blue-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Edit3 className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-blue-700">
                  Edit Posting
                </span>
              </button>
            </div>

            {/* Job Title and Location */}
            <div className="mb-6 md:mb-8">
              <h1 className="md:text-4xl text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 leading-tight">
                {jobTitle || "Job Title"}
              </h1>
              <div className="flex items-center gap-2 text-lg text-gray-600">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-sm md:text-base">
                  {location || "Location not specified"}
                </span>
              </div>
            </div>

            {/* Tags and Stats */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-6 md:mb-8">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 md:px-4 py-2 rounded-full font-semibold text-xs md:text-sm shadow-lg">
                <Star className="w-4 h-4" />
                {category}
              </span>
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-xs md:text-sm shadow-lg">
                <Users className="w-4 h-4" />
                {jobType}
              </span>
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full font-semibold text-xs md:text-sm shadow-lg">
                <Clock className="w-4 h-4" />
                Posted today
              </span>
            </div>

            {/* Compensation Card */}
            {(salaryMin || salaryMax) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-700 mb-1">
                      Annual Compensation
                    </p>
                    <p className="md:text-2xl text-xl font-bold text-green-800">
                      {salaryMin
                        ? `$${parseInt(salaryMin).toLocaleString()}`
                        : "N/A"}{" "}
                      -{" "}
                      {salaryMax
                        ? `$${parseInt(salaryMax).toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* About This Role */}
            <section className="py-8 ">
              <h3 className="text-lg font-semibold border-l-4 border-purple-600 pl-3 mb-4">
                About This Role
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded whitespace-pre-line">
                {description}
              </p>
            </section>

            {/* What We're Looking For */}
            <section>
              <h3 className="text-lg font-semibold border-l-4 border-pink-600 pl-3 mb-4">
                What We&#39;re Looking For
              </h3>
              <p className="text-gray-700 bg-pink-50 p-4 rounded whitespace-pre-line">
                {requirements}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;
