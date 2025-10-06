'use client';

import React from 'react';
import { Star, Quote, Briefcase, Users } from 'lucide-react';
import { Testimonial } from '@/types/testimonial';
import { testimonials } from '@/data/testimonialData';
import Image from 'next/image';

const Testimonials: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getUserTypeIcon = (userType: 'recruiter' | 'jobseeker') => {
    return userType === 'recruiter' ? (
      <Briefcase className="w-4 h-4 text-blue-500" />
    ) : (
      <Users className="w-4 h-4 text-green-500" />
    );
  };

  const getUserTypeBadge = (userType: 'recruiter' | 'jobseeker') => {
    const badgeClasses =
      userType === 'recruiter'
        ? 'bg-blue-100 text-blue-800 border-blue-200'
        : 'bg-green-100 text-green-800 border-green-200';

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badgeClasses}`}
      >
        {getUserTypeIcon(userType)}
        {userType === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
      </span>
    );
  };

  const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
    testimonial,
  }) => (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border
    border-gray-100 min-w-[300px] md:min-w-[390px] mx-3 hover:scale-105"
    >
      {/* Quote Icon */}
      <div className="flex justify-between items-start mb-4">
        <Quote className="w-8 h-8 text-blue-600 " />
        {getUserTypeBadge(testimonial.userType)}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {renderStars(testimonial.rating)}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 mb-6 leading-relaxed text-sm">
        &quot;{testimonial.testimonial}&quot;
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{testimonial.name}</div>
          <div className="text-sm text-gray-600">
            {testimonial.role}
            {testimonial.company && (
              <span className="text-blue-600"> • {testimonial.company}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="pt-10 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold  mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful recruiters and job seekers who have
            found their perfect match on HireHub
          </p>
        </div>

        {/* Auto-sliding Marquee */}
        <div className="relative mb-12">
          <div className="marquee-container overflow-hidden">
            <div className="marquee-content flex animate-marquee pause-marquee">
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
