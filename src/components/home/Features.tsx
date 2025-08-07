"use client";
import { jobSeekersFeatures, recruiterFeatures } from "@/constants/features";
import React from "react";

const Features = () => {
  return (
    <section className="py-10 md:py-12 bg-white relative">
      <div className=" container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-15">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <span className="text-blue-700 font-semibold text-sm uppercase tracking-wider">
              Features That Matter
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-none">
            <span className="block text-slate-900">
              Everything You Need To
            </span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative">
              Succeed
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover the perfect blend of innovation and simplicity designed to
            accelerate your career journey or hiring process.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-16">
          {/* Job Seekers Column */}
          <div className="space-y-8">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-semibold">For Job Seekers</h3>
              <div className="w-16 mx-auto h-1 bg-blue-600 mt-2"></div>
            </div>

            <div className="space-y-6">
              {jobSeekersFeatures?.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-50 hover:border-blue-300 transition-all duration-500 hover:shadow-lg hover:shadow-blue-100/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-white border border-blue-200 rounded-xl flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300 shadow-sm">
                      {feature?.icon ? <feature.icon /> : "🎯"}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">
                        {feature?.title || `Feature ${index + 1}`}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {feature?.description ||
                          "Amazing feature that will help you achieve your career goals faster and more efficiently."}
                      </p>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-2xl transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiters Column */}
          <div className="space-y-8">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-semibold">For Recruiters</h3>
              <div className="w-16 h-1 mx-auto bg-purple-600 mt-2"></div>
            </div>

            <div className="space-y-6">
              {recruiterFeatures?.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-gradient-to-l from-blue-50 to-white border border-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-50 hover:border-blue-300 transition-all duration-500 hover:shadow-lg hover:shadow-blue-100/50"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-white border border-blue-200 rounded-xl flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                      {feature?.icon ? <feature.icon /> : "⚡"}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">
                        {feature?.title || `Tool ${index + 1}`}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {feature?.description ||
                          "Powerful recruiting tool that streamlines your hiring process and helps you find top talent quickly."}
                      </p>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-2xl transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
