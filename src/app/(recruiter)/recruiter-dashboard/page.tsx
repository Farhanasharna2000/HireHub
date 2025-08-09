"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Briefcase, CheckCircle2, TrendingUp, Users } from "lucide-react";
import JobDashboardCard from "@/components/cards/JobDashboardCard";
import ApplicantDashboardCard from "@/components/cards/ApplicantDashboardCard";

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
}) => {
  return (
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
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: boolean;
  trendValue?: string | number;
  color?: "blue" | "green" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}) => {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-violet-500 to-violet-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} text-white border-0`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
          {trend && (
            <div className="flex items-center gap-1">
              <TrendingUp />
              <p className="text-sm mt-1">{trendValue}</p>
            </div>
          )}
        </div>
        <Icon className="h-8 w-8 opacity-70" />
      </div>
    </Card>
  );
};

interface DashboardCounts {
  totalActiveJobs: number;
  totalApplications: number;
  totalHired: number;
  trends: {
    activeJobs: number;
    totalApplications: number;
    totalHired: number;
  };
}

interface Job {
  id: string;
  title: string;
  location: string;
  createdAt: string;
  isClosed?: boolean;
  // add other fields if needed
}

interface Applicant {
  id: string;
  name: string;
  // add other fields if needed
}

interface RecentApplication {
  id: string;
  applicant: Applicant;
  job: {
    title: string;
  };
  updateAt: string;
  // add other fields if needed
}

interface DashboardData {
  counts: DashboardCounts;
  data?: {
    recentJobs: Job[];
    recentApplications: RecentApplication[];
  };
}

const RecruiterDashboard: React.FC = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:3000/api/analytics/overview");
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data: DashboardData = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
  }, []);

  function timeAgo(dateString: string): string {
    if (!dateString) return "";

    const now = new Date();
    const past = new Date(dateString);
    const diff = now.getTime() - past.getTime(); // difference in ms

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;

    const years = Math.floor(months / 12);
    return `${years} years ago`;
  }

  return (
    <DashboardLayout activeMenu="recruiter-dashboard">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {/* Dashboard stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Active Jobs"
              value={dashboardData?.counts?.totalActiveJobs || 0}
              icon={Briefcase}
              trend
              trendValue={`${dashboardData?.counts?.trends?.activeJobs || 0}%`}
              color="blue"
            />
            <StatCard
              title="Total Applicants"
              value={dashboardData?.counts?.totalApplications || 0}
              icon={Users}
              trend
              trendValue={`${
                dashboardData?.counts?.trends?.totalApplications || 0
              }%`}
              color="green"
            />
            <StatCard
              title="Hired"
              value={dashboardData?.counts?.totalHired || 0}
              icon={CheckCircle2}
              trend
              trendValue={`${dashboardData?.counts?.trends?.totalHired || 0}%`}
              color="purple"
            />
          </div>

          {/* Recent activity */}
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
              {dashboardData?.data?.recentJobs
                ?.slice(0, 3)
                ?.map((job) => (
                  <JobDashboardCard key={job.id} job={job} />
                ))}
            </div>
          </Card>
          <Card
            title="Recent Applications"
            subtitle="Latest candidate applications"
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
              {dashboardData?.data?.recentApplications
                ?.slice(0, 3)
                ?.map((application) => (
                  <ApplicantDashboardCard
                    key={application.id}
                    applicant={application.applicant}
                    position={application.job.title}
                    time={timeAgo(application.updateAt)}
                  />
                ))}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
