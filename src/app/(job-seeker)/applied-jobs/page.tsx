"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetAppliedJobsQuery } from "@/redux/jobs/jobsApi";
import DashboardLayout from "@/layouts/DashboardLayout";
import Loading from "@/app/loading";
import { Job } from "@/types/job";
import { Briefcase } from "lucide-react";

const AppliedJobs = () => {
  const user = useSelector((state: RootState) => state.user);
  
  // Ensure we don’t pass null to the query
  const { data, isLoading } = useGetAppliedJobsQuery(user.email ?? "");

  const jobs: Job[] = data?.jobs ?? [];

  return (
    <DashboardLayout activeMenu="applied-jobs">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid gap-4">
          {!jobs.length ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="relative mb-8">
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full p-6 border border-gray-200 dark:border-gray-700">
                    <Briefcase className="w-14 h-14 text-gray-400 dark:text-gray-600" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  No Applied Jobs Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8 leading-relaxed">
                  Start exploring job opportunities and apply the ones that match your interest. 
                  Your applied jobs will appear here for easy access.
                </p>            
              </div>
          ) : (
            jobs.map((job: Job) => (
              <div
                key={job._id}
                className="p-4 border rounded-md shadow bg-white"
              >
                <h2 className="font-semibold text-lg">{job.jobTitle}</h2>
                <p className="text-gray-700">{job.companyName}</p>
                <p className="text-gray-600">{job.location}</p>
                <span className="text-sm text-gray-500">
                  Applicants: {job.applicants}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AppliedJobs;
