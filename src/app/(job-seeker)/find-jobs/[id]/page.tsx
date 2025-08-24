'use client'
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import HomeLayout from "@/layouts/HomeLayout";
import Image from "next/image";
import { useGetAllJobsQuery } from "@/redux/jobs/jobsApi";

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
        <div className="min-h-screen flex justify-center items-center text-lg">
          Loading job details...
        </div>
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
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="max-w-3xl w-full p-6 bg-blue-50 rounded-lg shadow-md">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Image
              src={job.companyLogo || "/default-logo.png"}
                alt={`${job.companyName} logo`}
              width={100}
              height={100}
              className="w-20 h-20 object-contain rounded-md"
            />
            <div>
              <h1 className="text-3xl font-bold">{job.jobTitle}</h1>
              <p className="text-gray-600">{job.companyName}</p>
              <p className="text-sm text-gray-500">
                {job.location} • {job.category}
              </p>
              <p className="text-sm text-gray-500">Posted: {timeAgo(job?.createdAt)}</p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>
            </div>
          </div>

          {/* Job Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Job Details</h2>
            <p><strong>Job Type:</strong> {job.jobType}</p>
            <p>
              <strong>Salary:</strong>{" "}
           {job.salaryMin && job.salaryMax
                ? `৳${job.salaryMin} - ৳${job.salaryMax}`
                : "Negotiable"}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <p className="text-gray-700">{job.requirements}</p>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => alert("Apply functionality coming soon!")}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </HomeLayout>
  );
};

export default JobDetailsPage;
