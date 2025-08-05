"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="flex items-center justify-between p-4 shadow-md">
      {/* Logo */}
      <Link href="/" className="font-bold text-xl">
        HireHub
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 justify-center gap-6 text-lg font-medium">
        <Link href="/jobs">Jobs</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        {!isLoading && session?.user && (
          <Link href="/dashboard">Dashboard</Link>
        )}
      </div>

      {/* Auth Actions - Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {!isLoading && session?.user ? (
          <>
            <Image
              className="rounded-full border p-1"
              src={
                session.user.image ||
                "https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
              }
              width={40}
              height={40}
              alt="user"
              priority // optional: improve loading
            />
            <button
              onClick={() => signOut()}
              className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            {!isLoading && session?.user ? (
              <>
                <Image
                  className="rounded-full border p-1"
                  src={
                    session.user.image ||
                    "https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
                  }
                  width={40}
                  height={40}
                  alt="user"
                  priority
                />
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Sign In
              </Link>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Menu className="w-6 h-6 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mt-2">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/jobs">Jobs</Link>
              </DropdownMenuItem>
              {!isLoading && session?.user && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
