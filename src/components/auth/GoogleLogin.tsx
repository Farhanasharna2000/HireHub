"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

const GoogleLogin = () => {
  const session = useSession();
  const router = useRouter();
  const handleGoogleLogin = (providerName: string) => {
    signIn(providerName);
  };
  useEffect(() => {
    if (session?.status == "authenticated") {
      router.push("/");
      // toast.success("successfully logged in");
    }
  }, [session?.status, router]);
  return (
    <div>
      <button
        onClick={() => handleGoogleLogin("google")}
        className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100"
      >
        <Image
          src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
          alt=""
          width={20}
          height={20}
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
