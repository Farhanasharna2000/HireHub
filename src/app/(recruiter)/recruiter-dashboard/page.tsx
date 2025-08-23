"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Plus,
  Users,
} from "lucide-react";
import JobDashboardCard from "@/components/cards/JobDashboardCard";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetCompanyJobsQuery } from "@/redux/jobs/jobsApi";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  className,
  subtitle,
  title,
  headerAction,
  children,
}) => (
  <div className={`rounded-lg shadow-md border p-4 ${className || ""}`}>
    {(title || headerAction) && (
      <div className="flex justify-between items-start mb-2">
        <div>
          {title && <h3 className="font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {headerAction}
      </div>
    )}
    {children}
  </div>
);

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color?: "blue" | "green" | "purple";
}) => {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-violet-500 to-violet-600",
  };
  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} text-white border-0`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        <Icon className="h-8 w-8 opacity-70" />
      </div>
    </Card>
  );
};

const RecruiterDashboard: React.FC = () => {
  const router = useRouter();
  const { companyName } = useSelector((state: RootState) => state.user);

  // Fetch recruiter jobs
  const { data, isLoading } = useGetCompanyJobsQuery(companyName || "", {
    skip: !companyName,
  });

const { stats, recentJobs } = useMemo(() => {
  const jobs = data?.jobs || [];

  return {
    stats: {
      activeJobs: jobs.filter((j) => j.status === "Active").length,
      totalApplicants: jobs.reduce((sum, j) => sum + (j.applicants || 0), 0),
      hired: 0, 
    },
    recentJobs: [...jobs]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // newest first
      })
      .slice(0, 2), 
  };
}, [data]);


  return (
    <DashboardLayout activeMenu="recruiter-dashboard">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs}
              icon={Briefcase}
              color="blue"
            />
            <StatCard
              title="Total Applicants"
              value={stats.totalApplicants}
              icon={Users}
              color="green"
            />
            <StatCard
              title="Hired"
              value={stats.hired}
              icon={CheckCircle2}
              color="purple"
            />
          </div>

          {/* Recent Jobs */}
          <Card
            title="Recent Job Posts"
            subtitle="Your latest job postings"
            headerAction={
              <button
                onClick={() => router.push("/manage-jobs")}
                className="text-blue-600 hover:underline text-sm"
              >
                View all
              </button>
            }
          >
            <div className="space-y-4">
              {recentJobs.length ? (
                recentJobs
                  .slice(0, 3)
                  .map((job) => <JobDashboardCard key={job._id} job={job} />)
              ) : (
                <p className="text-gray-500 text-sm">No recent jobs found</p>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card
            title="Quick Actions"
            subtitle="Common tasks to get you started"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
              {[
                {
                  title: "Post New Job",
                  icon: Plus,
                  color: "bg-blue-100 text-blue-700",
                  path: "/post-job",
                },
                {
                  title: "Review Jobs",
                  icon: Briefcase,
                  color: "bg-green-100 text-green-700",
                  path: "/manage-jobs",
                },
                {
                  title: "Company Settings",
                  icon: Building2,
                  color: "bg-orange-100 text-orange-700",
                  path: "/company-profile",
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.path)}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border hover:shadow-md transition bg-gray-100"
                >
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="mt-2 text-sm font-medium">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
