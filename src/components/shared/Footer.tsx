import {Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div>
      <h3 className="text-2xl font-bold text-white mb-3">HireHub</h3>
          <p className="text-sm leading-relaxed">
            Connecting talented professionals with innovative companies
            worldwide. Your career success is our mission.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-blue-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/find-jobs" className="hover:text-blue-500 transition">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-500 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-500 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
          <p className="text-sm">Email: support@hirehub.com</p>
          <p className="text-sm">Phone: +1 234 567 890</p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-blue-500 transition">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="hover:text-blue-400 transition">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="hover:text-blue-600 transition">
              <Linkedin size={20} />
            </Link>
            <Link href="mailto:support@hirehub.com" className="hover:text-red-400 transition">
              <Mail size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HireHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
