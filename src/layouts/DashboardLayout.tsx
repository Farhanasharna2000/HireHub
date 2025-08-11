"use client";

import Link from "next/link";
import React, { useEffect, useState, MouseEvent } from "react";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { NAVIGATION_MENU } from "@/constants/features";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import ProfileDropdown from "@/components/ProfileDropdown";
import { signOut, useSession } from "next-auth/react";
import { setUser, clearUser } from "@/redux/features/user/userSlice";

interface DashboardLayoutProps {
  activeMenu?: string;
  children?: React.ReactNode;
}

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeMenu,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeNavItem, setActiveNavItem] = useState<string>(
    activeMenu || "Dashboard"
  );
  const [profileDropdownOpen, setProfileDropdownOpen] =
    useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { data: session, status } = useSession();

  // Get user from Redux store
  const user = useSelector((state: RootState) => state.user);

  // Sync Redux user state with NextAuth session user on session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setUser({
          id: session.user.id || null,
          email: session.user.email || null,
          username: session.user.username || null,
          role: session.user.role as "job_seeker" | "recruiter" | null,
        })
      );
    }
    if (status === "unauthenticated") {
      dispatch(clearUser());
    }
  }, [session, status, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) setProfileDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId: string) => {
    router.push(`/${itemId}`);
    setActiveNavItem(itemId);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const sidebarCollapsed = !isMobile && false; // placeholder for collapse

  return (
    <div className="flex min-h-screen bg-gray-50 ">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center space-x-2 border-b border-gray-200">
          {!sidebarCollapsed ? (
            <Link
              href="/"
              className="font-bold ml-3 text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              HireHub
            </Link>
          ) : (
            <div className="flex justify-center w-full">
              <Building2 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAVIGATION_MENU.map((item: NavigationItem) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex items-center px-3 py-2 w-full text-left rounded-lg ${
                activeNavItem === item.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        {user?.email && (
          <div className="absolute bottom-4 w-full px-4">
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 w-full px-2 py-1 rounded hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ml-0 transition-all duration-300 ${
          !isMobile ? (sidebarCollapsed ? "ml-16" : "ml-64") : ""
        }`}
      >
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 sticky top-0 z-30 border-b bg-white backdrop-blur-sm h-16">
          {/* Left */}
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 mr-2 rounded  hover:bg-gray-200"
              >
                {sidebarOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            )}
            <div>
              <h1 className=" font-semibold md:text-lg">Welcome back!</h1>
              <p className="hidden md:block">
                Here&apos;s what&apos;s happening with your jobs today.
              </p>
            </div>
          </div>

          {/* Right: Profile */}
          {status === "authenticated" && session?.user ? (
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={
                session.user.image ||
                "https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
              }
              companyName={user?.username || ""}
              email={user?.email || ""}
              userRole={user?.role || ""}
              onLogout={() => signOut()}
            />
          ) : null}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
