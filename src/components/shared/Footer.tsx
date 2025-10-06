import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-300">
      <div className="absolute inset-0 bg-[url('/footer-bg.svg')] bg-cover bg-center opacity-10"></div>

      <div className="relative container mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        {/* Brand Info */}
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-4">
            <Link href="/">HireHub</Link>
          </h1>
          <p className="text-sm leading-relaxed max-w-xs">
            Connecting talented professionals with innovative companies
            worldwide. Your career success is our mission.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-5">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/find-jobs', label: 'Jobs' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-blue-500 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">Contact Us</h3>
          <ul className="text-sm space-y-2">
            <li>
              <span className="font-medium">Email:</span>{' '}
              <Link
                href="mailto:support@hirehub.com"
                className="hover:text-blue-400 transition"
              >
                support@hirehub.com
              </Link>
            </li>
            <li>
              <span className="font-medium">Phone:</span> +1 234 567 890
            </li>
            <li>
              <span className="font-medium">Address:</span> 123 Innovation St,
              New York, USA
            </li>
          </ul>
        </div>

        {/* Newsletter + Social */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-5">
            Stay Connected
          </h4>
          <form className="flex bg-gray-800 rounded-full overflow-hidden mb-5">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 w-full bg-transparent text-sm focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 text-white text-sm font-medium transition"
            >
              Subscribe
            </button>
          </form>

          <div className="flex items-center gap-4 justify-start">
            <Link href="#" className="hover:text-blue-500 transition">
              <Facebook size={22} />
            </Link>
            <Link href="#" className="hover:text-sky-400 transition">
              <Twitter size={22} />
            </Link>
            <Link href="#" className="hover:text-blue-600 transition">
              <Linkedin size={22} />
            </Link>
            <Link
              href="mailto:support@hirehub.com"
              className="hover:text-red-400 transition"
            >
              <Mail size={22} />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700/50 text-center py-5 text-sm text-gray-500">
        © {new Date().getFullYear()}{' '}
        <span className="text-white">HireHub</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
