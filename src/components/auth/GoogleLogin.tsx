"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/user/userSlice";

const GoogleLogin = () => {
  const { status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    signIn("google");
  };

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch session info
      getSession().then((session) => {
        if (session?.user) {
          dispatch(
            setUser({
              id: session.user.id || null,
              email: session.user.email || null,
              username: session.user.username || null,
              role: (session.user.role as "job_seeker" | "recruiter") || null,
              companyName: session.user.companyName || null,
            })
          );
        }
        router.push("/");
      });
    }
  }, [status, dispatch, router]);

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 cursor-pointer"
      >
        <Image
          src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
          alt="Google logo"
          width={20}
          height={20}
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLogin;