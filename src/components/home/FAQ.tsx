import React from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is HireHub?",
    answer:
      "HireHub is a platform that connects talented job seekers with recruiters from innovative companies worldwide. Recruiters can post jobs, and job seekers can apply directly.",
  },
  {
    question: "How do I create an account as a job seeker?",
    answer:
      "Simply click on the 'Register' button, choose 'Job Seeker', fill out the registration form, and start applying for jobs that match your skills.",
  },
  {
    question: "How can recruiters post jobs?",
    answer:
      "Once signed in as a recruiter, go to your dashboard, click 'Post a Job', fill in the job details, and publish. Your job post will instantly be visible to job seekers.",
  },
  {
    question: "Is it free to use HireHub?",
    answer:
      "Yes, job seekers can use HireHub for free. Recruiters can post a limited number of jobs for free, with premium plans available for more features.",
  },
  {
    question: "How do I apply for a job?",
    answer:
      "Find a job you’re interested in, click 'Apply Now', upload your resume, and submit your application. The recruiter will contact you if shortlisted.",
  },
  {
    question: "Can I update my profile later?",
    answer:
      "Yes, you can update your profile, resume, and skills anytime from your account settings.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-gray-50 pt-6 pb-10 md:pt-12 md:pb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <summary className="flex justify-between items-center cursor-pointer text-lg font-medium text-gray-700">
                {faq.question}
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
