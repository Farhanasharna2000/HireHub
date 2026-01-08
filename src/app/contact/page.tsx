"use client";
import React, { useState } from "react";
import HomeLayout from "./../../layouts/HomeLayout";
import {
  Mail,
  Phone,
  Send,
  User,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <HomeLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-600 py-10 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative text-center container mx-auto px-4">
          <h1 className="text-3xl md:text-6xl font-bold text-white drop-shadow-lg">
            Contact HireHub
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mt-6 leading-relaxed">
            Get in touch with us for any questions or support.
          </p>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-12 container mx-auto px-4 bg-gray-50 py-10 md:py-12">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="md:text-3xl text-xl font-bold text-gray-900 mb-6">
            Send us a message
          </h2>

          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-gray-600">
                Thank you for contacting us. We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-md font-semibold  transition duration-200 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="md:text-3xl text-xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@hirehub.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 234 567 890</p>
                </div>
              </div>
            </div>
          </div>

        
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Need Quick Help?
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">For Job Seekers</h4>
                <p className="text-sm text-gray-600">
                  Questions about finding jobs, applying, or your profile
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">For Employers</h4>
                <p className="text-sm text-gray-600">
                  Help with posting jobs, managing candidates, or billing
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Technical Issues</h4>
                <p className="text-sm text-gray-600">
                  Website problems, login issues, or bug reports
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default ContactPage;
