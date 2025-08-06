"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GoogleLogin from "./GoogleLogin";
import { registerUser } from "@/app/actions/auth/register";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/user/userSlice";

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
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: FormData) => {
    if (type === "register") {
      try {
        const response = await registerUser(data);

        if (response?.acknowledged) {
          // Auto-login after registration
          const loginResult = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          if (loginResult?.ok) {
            const newSession = await getSession(); //  fetch session data after login

            if (newSession?.user) {
              dispatch(
                setUser({
                  id: newSession.user.id || null,
                  email: newSession.user.email || null,
                  username: newSession.user.username || null,
                  role:
                    (newSession.user.role as "job_seeker" | "recruiter") ||
                    null,
                })
              );
            }

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
        console.log(err);
        setError("Registration error");
      }
    } else {
      // Signin flow
      try {
        const { email, password } = data;
        const response = await signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
          redirect: false,
        });

        if (response?.ok) {
          const newSession = await getSession(); //  fetch session data after login
          if (newSession?.user) {
            dispatch(
              setUser({
                id: newSession.user.id || null,
                email: newSession.user.email || null,
                username: newSession.user.username || null,
                role:
                  (newSession.user.role as "job_seeker" | "recruiter") || null,
              })
            );
          }

          toast.success("Logged in successfully");
          reset();
          router.push("/");
        } else {
          setError("Invalid credentials");
        }
      } catch (error) {
        console.log(error);
        setError("Authentication failed");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
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
            <a className="text-blue-500 underline" href="/register">
              Register
            </a>
          </>
        ) : (
          <>
            Already registered?{" "}
            <a className="text-blue-500 underline" href="/login">
              Sign In
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
