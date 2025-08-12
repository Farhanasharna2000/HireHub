"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/constants/jobs";
import HomeLayout from "@/layouts/HomeLayout";
import Image from "next/image";

const JobDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Find job by id
  const job = mockJobs.find((job) => job.id === id);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Job Not Found</h2>
        <Button onClick={() => router.push("/find-jobs")}>Back to Jobs</Button>
      </div>
    );
  }

  return (
       <>
      <HomeLayout>
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="max-w-3xl w-full p-6 bg-blue-50 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <Image
            src={job.logo}
            alt={`${job.company} logo`}
            width={20}
            height={20}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">
              {job.location} • {job.type}
            </p>
            <p className="text-sm text-gray-500">Posted: {job.postedDate}</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Job Details</h2>
          <p>Category: {job.category}</p>
          <p>Salary: {job.salary}</p>
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
    </>
  );
};

export default JobDetailsPage;
