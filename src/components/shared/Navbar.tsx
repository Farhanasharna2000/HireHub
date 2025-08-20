"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/redux/store";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  // console.log(user)

  const handleDashboardRedirect = () => {
    if (user.role === "recruiter") {
      router.push("/recruiter-dashboard");
    } else if (user.role === "job_seeker") {
      router.push("/jobseeker-dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md  py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent "
        >
          HireHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center gap-6 text-lg font-medium">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/find-jobs" className="hover:text-blue-600">
            Jobs
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            Contact
          </Link>
          {!isLoading && session?.user && (
            <button
              onClick={handleDashboardRedirect}
              className="cursor-pointer hover:text-blue-600"
            >
              Dashboard
            </button>
          )}
        </div>

        {/* Auth Actions - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoading && session?.user ? (
            <>
              <div className="w-10 h-10 rounded-full overflow-hidden border">
                <Image
                  src={
                    session?.user?.companyLogo ||
                    session?.user?.image ||
                    "https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
                  }
                  alt="user"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              <button
                onClick={() => signOut()}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 md:py-[6px] bg-blue-600 hover:bg-blue-700 text-white rounded"
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
                    className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
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
                  <Link href="/" className="hover:text-blue-600">
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/find-jobs" className="hover:text-blue-600">
                    Jobs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about" className="hover:text-blue-600">
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="hover:text-blue-600">
                    Contact
                  </Link>
                </DropdownMenuItem>
                {!isLoading && session?.user && (
                  <DropdownMenuItem
                    onClick={handleDashboardRedirect}
                    className="hover:text-blue-600"
                  >
                    Dashboard
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
