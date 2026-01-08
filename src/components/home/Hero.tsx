"use client";

import {
  ArrowRight,
  Building2,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { motion, Variants } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";

interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  gradient: string;
}

const Hero = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = useSelector((state: RootState) => state.user);

  const stats: Stat[] = [
    {
      icon: Users,
      label: "Active Users",
      value: "2.4M+",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      icon: Building2,
      label: "Companies",
      value: "50k+",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Jobs Posted",
      value: "150k+",
      gradient: "from-blue-600 to-purple-600",
    },
  ];

  const handleFindJobs = () => {
    router.push("/find-jobs");
  };

  const handlePostJobs = () => {
    if (session?.user && user.role === "recruiter") {
      router.push("/post-job");
    } else {
      router.push("/login");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 md:py-12">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight"
          >
            <span className="text-gray-800">Find Your Dream Job or</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Hire
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Connect with opportunities that matter. Join millions of
            professionals and innovative companies building the future together.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 md:mb-16"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.25)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFindJobs}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all duration-300 font-semibold text-lg min-w-[200px] cursor-pointer"
            >
              <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Find Jobs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePostJobs}
              className="group flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200/60 hover:border-blue-300/80 text-blue-700 rounded-2xl shadow-lg shadow-blue-100/30 transition-all duration-300 font-semibold text-lg min-w-[200px] cursor-pointer"
            >
              <Building2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Post a Job</span>
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 container mx-auto px-4 pb-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                  }}
                  className="relative group cursor-pointer"
                >
                  <div className="relative bg-white/90 backdrop-blur-md border border-blue-100/80 rounded-3xl p-8 shadow-xl shadow-blue-100/40 group-hover:shadow-2xl group-hover:shadow-blue-200/50 transition-all duration-300">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} mb-4 md:mb-6 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="md:text-4xl text-xl font-bold text-gray-800 mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-semibold text-lg">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/80 to-transparent"></div>
    </section>
  );
};

export default Hero;
