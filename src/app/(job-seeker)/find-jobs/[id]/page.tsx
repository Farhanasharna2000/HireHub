"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import HomeLayout from "@/layouts/HomeLayout";
import { useGetAllJobsQuery } from "@/redux/jobs/jobsApi";
import Loading from "@/app/loading";
import {
  Clock,
  MapPin,
  DollarSign,
  Users,
  Star,
  Briefcase,
} from "lucide-react";
import Image from "next/image";

const JobDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetAllJobsQuery();
  const jobs = data?.jobs || [];

  // Find job by ID
  const job = jobs.find((job) => job._id === id);

  if (isLoading) {
    return (
      <HomeLayout>
        <Loading />
      </HomeLayout>
    );
  }

  if (!job) {
    return (
      <HomeLayout>
        <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Job Not Found</h2>
          <Button onClick={() => router.push("/find-jobs")}>
            Back to Jobs
          </Button>
        </div>
      </HomeLayout>
    );
  }

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

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            {/* Top gradient bar */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            {/* Header content */}
            <div className="md:p-8 p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="md:text-2xl text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Job Details
                </h2>

                <Button
                  disabled={job.isApplied}
                  onClick={() =>
                    job.isApplied
                      ? alert("You already applied to this job!")
                      : alert("Apply functionality coming soon!")
                  }
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    job.isApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                  }`}
                >
                  {job.isApplied ? "Applied" : "Apply Now"}
                </Button>
              </div>

              {/* Company Info */}
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={job.companyLogo || "/default-logo.png"}
                  alt="companyName"
                  width={80}
                  height={80}
                  className="rounded-lg object-cover border"
                />
                <div>
                  <h1 className="md:text-4xl text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    {job.jobTitle}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <h3 className="font-medium text-sm md:text-base">
                      {job.companyName}
                    </h3>
                    <MapPin className="size-4 text-blue-500" />
                    <span className="font-medium text-sm md:text-base">
                      {job.location}
                    </span>
                  </div>

                  {/* Tags and Stats */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-full font-semibold text-xs  shadow-lg">
                      <Star className="size-3" />
                      {job.category}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-full font-semibold text-xs  shadow-lg">
                      <Users className="size-3" />
                      {job.jobType}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-full font-semibold text-xs  shadow-lg">
                      <Clock className="size-3" />
                      Posted {timeAgo(job.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compensation Card */}
              {(job.salaryMin || job.salaryMax) && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-700 mb-1">
                        Annual Compensation
                      </p>
                      <p className="md:text-2xl text-xl font-bold text-green-800">
                        {job.salaryMin
                          ? `৳${parseInt(job.salaryMin).toLocaleString()}`
                          : "N/A"}{" "}
                        -{" "}
                        {job.salaryMax
                          ? `৳${parseInt(job.salaryMax).toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* About This Role */}
              <section className="py-6">
                <h3 className="text-lg font-semibold border-l-4 border-purple-600 pl-3 mb-4">
                  About This Role
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded whitespace-pre-line">
                  {job.description}
                </p>
              </section>

              {/* What We're Looking For */}
              <section className="py-6">
                <h3 className="text-lg font-semibold border-l-4 border-pink-600 pl-3 mb-4">
                  What We&#39;re Looking For
                </h3>
                <p className="text-gray-700 bg-pink-50 p-4 rounded whitespace-pre-line">
                  {job.requirements}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default JobDetailsPage;
