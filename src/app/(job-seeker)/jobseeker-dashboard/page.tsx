"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useRouter } from "next/navigation";
import React from "react";
import { Bookmark, Briefcase, Building2, CheckCircle2, Plus } from "lucide-react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, subtitle, title, headerAction, children }) => (
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
    <Card className={`bg-gradient-to-br ${colorClasses[color]} text-white border-0`}>
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

const JobSeekerDashboard: React.FC = () => {
  const router = useRouter();

  // Hardcoded stats
  const stats = { appliedJobs: 0, savedJobs: 0, interviews: 0 };

  // Hardcoded quick actions
  const quickActions = [
    { title: "Applied Jobs", icon: Plus, color: "bg-blue-100 text-blue-700", path: "/applied-jobs" },
    { title: "Saved Jobs", icon: Briefcase, color: "bg-green-100 text-green-700", path: "/saved-jobs" },
    { title: "Profile Settings", icon: Building2, color: "bg-orange-100 text-orange-700", path: "/profile" },
  ];

  return (
    <DashboardLayout activeMenu="jobseeker-dashboard">

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Applied Jobs" value={stats.appliedJobs} icon={Briefcase} color="blue" />
            <StatCard title="Saved Jobs" value={stats.savedJobs} icon={Bookmark} color="green" />
            <StatCard title="Interviews" value={stats.interviews} icon={CheckCircle2} color="purple" />
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions" subtitle="Common tasks to get you started">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.path)}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border hover:shadow-md transition bg-gray-100"
                >
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="mt-2 text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;
