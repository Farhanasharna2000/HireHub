"use client";

import { ArrowRight, Building2, Search, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";

const Hero = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = useSelector((state: RootState) => state.user);

  const stats = [
    { icon: Users, label: "Active Users", value: "2.4M+" },
    { icon: Building2, label: "Companies", value: "50k+" },
    { icon: TrendingUp, label: "Jobs Posted", value: "150k+" },
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

  return (
    <section className="md:py-20 py-8 text-center bg-gray-50">
      <div className="container mx-auto px-6 ">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold mb-4 max-w-2xl mx-auto"
        >
          Find Your Dream Job or{" "}
          <span className="text-blue-600">Perfect Hire</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto"
        >
          Connect talented professionals with innovative companies. Your next
          career move or perfect candidate is just one click away.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-row justify-center items-center gap-4 mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFindJobs}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            <Search className="w-5 h-5" />
            <span>Find Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Always show this button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePostJobs}
            className="px-5 py-3 bg-white  rounded-md shadow hover:bg-gray-50 transition"
          >
            Post a Job
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className="bg-white rounded-md shadow-md p-6"
              >
                <div className="flex justify-center mb-2 text-blue-600">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
