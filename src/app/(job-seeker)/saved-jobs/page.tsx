'use client'
import Loading from "@/app/loading";
import JobCard from "@/components/jobseeker/JobCard";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useGetAllJobsQuery } from "@/redux/jobs/jobsApi";
import { RootState } from "@/redux/store";
import { Job } from "@/types/job";
import { BookmarkIcon} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const SavedJobs = () => {
  const { data, isLoading } = useGetAllJobsQuery();
  const user = useSelector((state: RootState) => state.user);

  // Filter jobs saved by this user
 const savedJobs = data?.jobs.filter(
  (job: Job) => user.email !== null && job?.savedUsers?.includes(user.email)
);
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full p-6 border border-gray-200 dark:border-gray-700">
          <BookmarkIcon className="w-14 h-14 text-gray-400 dark:text-gray-600" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        No Saved Jobs Yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8 leading-relaxed">
        Start exploring job opportunities and save the ones that catch your interest. 
        Your saved jobs will appear here for easy access.
      </p>            
    </div>
  );
  return (
    <DashboardLayout activeMenu="saved-jobs">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="p-6">
         
          {savedJobs && savedJobs.length > 0 ? (
            <>
          <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
              <BookmarkIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Saved Jobs</h1>
            <p className="text-gray-500">
              Explore your saved jobs and apply to get opportunity
            </p>
          </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedJobs.map((job) => (
                <JobCard key={job._id} job={job} onClick={() => {}} viewMode="grid" />
              ))}
            </div>
            </>
          ) : (
              <EmptyState />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedJobs;