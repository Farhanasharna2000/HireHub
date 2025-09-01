"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Bookmark, Briefcase, Building2, CheckCircle2, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
    <div className={`rounded-lg shadow-md p-4 bg-gradient-to-br ${colorClasses[color]} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        <Icon className="h-8 w-8 opacity-70" />
      </div>
    </div>
  );
};

const JobSeekerDashboard: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState({ appliedJobs: 0, savedJobs: 0, interviews: 0 });
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const userEmail = user.email;

        const res = await fetch(`/api/job-stats?userEmail=${userEmail}`);
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

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
        <div className="rounded-lg shadow-md border p-4">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;
