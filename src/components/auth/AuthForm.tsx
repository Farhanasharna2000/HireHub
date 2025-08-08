"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GoogleLogin from "./GoogleLogin";
import { registerUser } from "@/app/actions/auth/register";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/user/userSlice";
import Link from "next/link";

interface AuthFormProps {
  type: "register" | "signin";
}

interface FormData {
  username?: string;
  email: string;
  password: string;
  role?: "job_seeker" | "recruiter";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { data: session, update } = useSession(); // Get and refresh session
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleUserDispatch = () => {
    if (session?.user) {
      dispatch(
        setUser({
          id: session.user.id || null,
          email: session.user.email || null,
          username: session.user.username || null,
          role: (session.user.role as "job_seeker" | "recruiter") || null,
        })
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    setError(""); // clear old errors

    if (type === "register") {
      try {
        const response = await registerUser(data);

        if (response?.acknowledged) {
          const loginResult = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          if (loginResult?.ok) {
            await update(); // refresh the session
            handleUserDispatch();

            toast.success("Registered successfully");
            reset();
            router.push("/");
          } else {
            setError("Registration failed.");
          }
        } else {
          setError("Credentials already exist");
        }
      } catch (err) {
        console.error(err);
        setError("Registration error");
      }
    } else {
      try {
        const { email, password } = data;
        const response = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (response?.ok) {
          await update(); // refresh the session
          handleUserDispatch();

          toast.success("Logged in successfully");
          reset();
          router.push("/");
        } else {
          setError("Invalid credentials");
        }
      } catch (err) {
        console.error(err);
        setError("Authentication failed");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 text-center font-bold">
        {type === "signin" ? "Sign In" : "Register"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type === "register" && (
          <>
            <input
              {...register("username")}
              type="text"
              placeholder="Username"
              required
              className="w-full p-2 border rounded"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    {...register("role")}
                    type="radio"
                    value="job_seeker"
                    required
                    className="mr-2"
                  />
                  Job Seeker
                </label>
                <label className="flex items-center">
                  <input
                    {...register("role")}
                    type="radio"
                    value="recruiter"
                    required
                    className="mr-2"
                  />
                  Recruiter
                </label>
              </div>
            </div>
          </>
        )}

        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />

        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="w-full p-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-600"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded hover:bg-blue-700 transition"
        >
          {type === "signin" ? "Sign in" : "Register"}
        </button>
      </form>

      <div className="my-4 text-center text-sm text-gray-500">or</div>

      <GoogleLogin />

      <div className="mt-4 text-sm text-center">
        {type === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link className="text-blue-500 underline" href="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link className="text-blue-500 underline" href="/login">
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
