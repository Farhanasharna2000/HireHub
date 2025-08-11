import React from "react";
import {
  Target,
  Heart,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  Linkedin,
  Twitter,
  CheckCircle,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import HomeLayout from "@/layouts/HomeLayout";

const About: React.FC = () => {
  return (
    <HomeLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-600 py-10 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative text-center container mx-auto px-4">
          <h1 className="text-3xl md:text-6xl font-bold text-white drop-shadow-lg">
            About HireHub
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mt-6 leading-relaxed">
            Connecting talent with opportunity through intelligent matching &
            cutting-edge technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: Globe, text: "Global Platform" },
              { icon: Shield, text: "Secure & Trusted" },
              { icon: Heart, text: "Human-Centered" },
            ].map((item, idx) => (
              <span
                key={idx}
                className="flex items-center px-4 py-2 bg-white/10 rounded-full text-white text-sm backdrop-blur-sm border border-white/20"
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="md:py-16 py-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          {[
            {
              icon: Briefcase,
              value: "150K+",
              label: "Jobs Posted",
              color: "text-blue-600",
            },
            {
              icon: Users,
              value: "2.4M+",
              label: "Active Users",
              color: "text-green-600",
            },
            {
              icon: TrendingUp,
              value: "95%",
              label: "Success Rate",
              color: "text-purple-600",
            },
            {
              icon: Award,
              value: "500+",
              label: "Companies Trust Us",
              color: "text-orange-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 p-4 md:p-6 hover:scale-105"
            >
              <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
              <div className="md:text-3xl text-xl font-bold">{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          {/* Mission */}
          <div>
            <h2 className="md:text-4xl text-xl font-bold mb-6">Our Mission</h2>
            <p className="md:text-lg text-gray-600 mb-6">
              Revolutionizing how people find jobs and how companies discover
              talent, powered by tech and human insight.
            </p>
            {[
              {
                title: "Democratize Opportunities",
                desc: "Accessible to everyone, regardless of background.",
              },
              {
                title: "Streamline Hiring",
                desc: "Find the right talent faster and efficiently.",
              },
              {
                title: "Foster Growth",
                desc: "Support career and business growth with better matches.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 mb-4">
                <CheckCircle className="text-green-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Vision */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600  text-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl md:text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-blue-100 mb-6 md:text-lg ">
              To be the most trusted global platform where every seeker finds
              their dream job and every company finds its perfect hire.
            </p>
            <div className="grid grid-cols-2 text-center">
              <div>
                <div className="md:text-2xl text-lg font-bold">2020</div>
                <p className="text-blue-200 text-sm">Founded</p>
              </div>
              <div>
                <div className="md:text-2xl  text-lg font-bold">25+</div>
                <p className="text-blue-200 text-sm">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="md:pt-12 py-10 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold md:mb-8 mb-4">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Precision Matching",
                desc: "AI ensures perfect candidate-job fit.",
              },
              {
                icon: Heart,
                title: "Human-Centered",
                desc: "We prioritize user experience.",
              },
              {
                icon: Shield,
                title: "Trust & Security",
                desc: "Enterprise-grade protection.",
              },
              {
                icon: Zap,
                title: "Innovation",
                desc: "Always evolving with latest tech.",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
              >
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gray-50 mb-6">
                  <value.icon className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-10 md:pt-5 md:pb-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-8">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Thompson",
                role: "CEO & Founder",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Sarah Kim",
                role: "CTO",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Product",
                avatar: "https://randomuser.me/api/portraits/men/76.jpg",
              },
              {
                name: "Emily Chen",
                role: "VP of Marketing",
                avatar: "https://randomuser.me/api/portraits/women/65.jpg",
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover shadow-md border-2 border-white"
                />

                <h3 className="font-bold">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-4">{member.role}</p>
                <div className="flex justify-center gap-3 text-gray-400">
                  <Linkedin className="w-5 h-5 hover:text-blue-600" />
                  <Twitter className="w-5 h-5 hover:text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </HomeLayout>
  );
};

export default About;
