import { Job } from "@/types/job";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface JobResponse {
  success: boolean;
  id?: string;
  error?: string;
}

export interface JobFormInputs {
  jobTitle: string;
  location: string;
  category: string;
  jobType: string;
  description: string;
  requirements: string;
  companyName?: string | null;
  companyLogo?: string | null;
  salaryMin?: string;
  salaryMax?: string;
}

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Jobs"],
  endpoints: (builder) => ({
    // Create a new job
    createJob: builder.mutation<JobResponse, JobFormInputs>({
      query: (jobData) => ({
        url: "jobs",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Jobs"],
    }),

    // ✅ API returns { jobs: Job[] }
    getCompanyJobs: builder.query<{ jobs: Job[] }, string>({
      query: (companyName) => `jobs?companyName=${companyName}`,
      providesTags: ["Jobs"],
    }),

    // Update job status
    updateJobStatus: builder.mutation<
      JobResponse,
      { id: string; status: "Active" | "Closed" }
    >({
      query: ({ id, status }) => ({
        url: `jobs?id=${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Jobs"],
    }),

    // Delete job
    deleteJob: builder.mutation<JobResponse, string>({
      query: (id) => ({
        url: `jobs?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetCompanyJobsQuery,
  useUpdateJobStatusMutation,
  useDeleteJobMutation,
} = jobsApi;
