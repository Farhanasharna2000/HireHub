import { Job } from "@/types/job";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface JobResponse {
  success: boolean;
  id?: string;
  savedUsers?: string[];
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
    createJob: builder.mutation<JobResponse, JobFormInputs>({
      query: (jobData) => ({ url: "jobs", method: "POST", body: jobData }),
      invalidatesTags: ["Jobs"],
    }),

    getAllJobs: builder.query<{ jobs: Job[] }, void>({
      query: () => "jobs",
      providesTags: ["Jobs"],
    }),

    getCompanyJobs: builder.query<{ jobs: Job[] }, string>({
      query: (companyName) => `jobs?companyName=${companyName}`,
      providesTags: ["Jobs"],
    }),

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

    toggleSavedJob: builder.mutation<
      JobResponse,
      { id: string; userEmail: string }
    >({
      query: ({ id, userEmail }) => ({
        url: "jobs",
        method: "PATCH",
        body: { id, userEmail }, // send logged-in user's email
      }),
      invalidatesTags: ["Jobs"],
    }),

    deleteJob: builder.mutation<JobResponse, string>({
      query: (id) => ({ url: `jobs?id=${id}`, method: "DELETE" }),
      invalidatesTags: ["Jobs"],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetCompanyJobsQuery,
  useUpdateJobStatusMutation,
  useDeleteJobMutation,
  useGetAllJobsQuery,
  useToggleSavedJobMutation,
} = jobsApi;
