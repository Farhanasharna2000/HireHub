"use client";
import React from "react";
import { Star, Quote, Briefcase, Users } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  testimonial: string;
  rating: number;
  userType: "recruiter" | "jobseeker";
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "HR Director",
    company: "TechCorp Solutions",
    testimonial:
      "HireHub has revolutionized our hiring process. We've reduced our time-to-hire by 60% and found incredibly talented candidates. The platform's filtering system is exceptional.",
    rating: 5,
    userType: "recruiter",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Full Stack Developer",
    testimonial:
      "I found my dream job through HireHub in just 2 weeks! The job matching algorithm is spot-on, and the application process is so smooth. Highly recommend to fellow developers.",
    rating: 5,
    userType: "jobseeker",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Talent Manager",
    company: "Global Innovations Inc",
    testimonial:
      "The quality of candidates on HireHub is outstanding. We've hired 15 employees through the platform this year, and each one has been a perfect fit for our company culture.",
    rating: 5,
    userType: "recruiter",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Product Manager",
    testimonial:
      "After months of job searching, HireHub connected me with my current role at an amazing startup. The personalized job recommendations made all the difference!",
    rating: 5,
    userType: "jobseeker",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Recruitment Lead",
    company: "NextGen Startups",
    testimonial:
      "HireHub's analytics dashboard helps us track our hiring metrics and optimize our job postings. It's like having a recruitment consultant built into the platform.",
    rating: 5,
    userType: "recruiter",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "UX Designer",
    testimonial:
      "The portfolio showcase feature on HireHub helped me stand out from other candidates. I received multiple interview requests within days of creating my profile!",
    rating: 5,
    userType: "jobseeker",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 7,
    name: "Rachel Kim",
    role: "Senior Recruiter",
    company: "Innovation Labs",
    testimonial:
      "The candidate screening tools save us hours every week. We can quickly identify the best matches and focus our time on meaningful interviews.",
    rating: 5,
    userType: "recruiter",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 8,
    name: "Alex Martinez",
    role: "Data Scientist",
    testimonial:
      "HireHub's skill assessment feature helped me showcase my abilities beyond just my resume. Landed three interviews in my first week!",
    rating: 5,
    userType: "jobseeker",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80",
  },
];


const Testimonials: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getUserTypeIcon = (userType: "recruiter" | "jobseeker") => {
    return userType === "recruiter" ? (
      <Briefcase className="w-4 h-4 text-blue-500" />
    ) : (
      <Users className="w-4 h-4 text-green-500" />
    );
  };

  const getUserTypeBadge = (userType: "recruiter" | "jobseeker") => {
    const badgeClasses =
      userType === "recruiter"
        ? "bg-blue-100 text-blue-800 border-blue-200"
        : "bg-green-100 text-green-800 border-green-200";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badgeClasses}`}
      >
        {getUserTypeIcon(userType)}
        {userType === "recruiter" ? "Recruiter" : "Job Seeker"}
      </span>
    );
  };

  const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
    testimonial,
  }) => (
    <div
      className="bg-white rounded-xl p-6 border
     border-gray-100 min-w-[300px] md:min-w-[390px] mx-3 "
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
        {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {testimonial.avatar}
        </div> */}
<div className="relative w-14 h-14 md:w-20 md:h-20">
  <Image
    src={testimonial.avatar}
    alt={testimonial.name}
    fill
    className="rounded-full object-cover border border-gray-200"
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
            <div className="marquee-content flex animate-marquee hover:pause-marquee">
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

      {/* Custom CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
        }

        .hover\\:pause-marquee:hover {
          animation-play-state: paused;
        }

        .marquee-container {
          mask: linear-gradient(
            90deg,
            transparent,
            white 10%,
            white 90%,
            transparent
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent,
            white 10%,
            white 90%,
            transparent
          );
        }

        /* Responsive animation speed */
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 30s;
          }
        }

        @media (max-width: 480px) {
          .animate-marquee {
            animation-duration: 25s;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
