"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileDropdownProps {
  isOpen: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  avatar?: string | null;
  companyName: string;
  email: string;
  userRole?: string | null;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  userRole,
  onLogout,
}) => {

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 focus:outline-none"
        type="button"
      >
        {avatar ? (
          <Image src={avatar} alt="" width={30} height={30} className="rounded-full" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center uppercase font-bold">
            {companyName.charAt(0)}
          </div>
        )}
        <div className=" text-left hidden md:block">
          <p className="text-sm font-medium uppercase">{companyName}</p>
          <p className="text-xs text-gray-500">{userRole === "recruiter" ? "Recruiter" : "Job Seeker"}</p>
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          <div className="p-3 border-b">
            <p className="font-semibold uppercase text-xs md:text-base">{companyName}</p>
            <p className="text-xs text-gray-600 truncate">{email}</p>
          </div>
          <Link
            href={userRole === "job_seeker" ? "/profile" : "/company-profile"}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            View Profile
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left text-red-600 px-4 py-2 text-sm hover:bg-gray-100"
            type="button"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
