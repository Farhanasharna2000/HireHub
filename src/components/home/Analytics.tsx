import React from "react";
import { Briefcase, Target, TrendingUp, Users } from "lucide-react";

interface Stats {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  growth: string;
  colorClasses: {
    bg: string;
    icon: string;
    text: string;
  };
}

const Analytics = () => {
  const stats: Stats[] = [
    {
      icon: Users,
      label: "Active Users",
      value: "2.4M+",
      growth: "+15%",
      colorClasses: {
        bg: "bg-blue-100",
        icon: "text-blue-600",
        text: "text-blue-600"
      }
    },
    {
      icon: Briefcase,
      label: "Jobs Posted",
      value: "150k+",
      growth: "+22%",
      colorClasses: {
        bg: "bg-purple-100",
        icon: "text-purple-600",
        text: "text-purple-600"
      }
    },
    {
      icon: Target,
      label: "Successful Hires",
      value: "89k+",
      growth: "+18%",
      colorClasses: {
        bg: "bg-green-100",
        icon: "text-green-600",
        text: "text-green-600"
      }
    },
    {
      icon: TrendingUp,
      label: "Match Rate",
      value: "94%",
      growth: "+8%",
      colorClasses: {
        bg: "bg-orange-100",
        icon: "text-orange-600",
        text: "text-orange-600"
      }
    },
  ];

  return (
    <section className="py-10 md:py-12 bg-gray-50 ">
      <div className="container mx-auto px-4 ">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Platform <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Analytics</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Real-time insights and data-driven results that showcase the power
            of our platform in connecting talent with opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.colorClasses.bg} transition-transform duration-300 hover:scale-110`}
                  >
                    <Icon className={`w-6 h-6 ${stat.colorClasses.icon}`} />
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stat.colorClasses.bg} ${stat.colorClasses.text}`}>
                    {stat.growth}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Analytics;