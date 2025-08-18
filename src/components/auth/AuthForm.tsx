"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Eye, EyeOff, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GoogleLogin from "./GoogleLogin";
import { registerUser } from "@/app/actions/auth/register";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/user/userSlice";
import Link from "next/link";
import Image from "next/image";

interface AuthFormProps {
  type: "register" | "signin";
}

interface FormData {
  username?: string;
  email: string;
  password: string;
  role?: "job_seeker" | "recruiter";
  companyName?: string;
  companyLogo?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>();
  const { data: session, update } = useSession();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch();

  // Watch the role field to conditionally show company fields
  const selectedRole = watch("role");

  const handleUserDispatch = () => {
    if (session?.user) {
      dispatch(
        setUser({
          id: session.user.id || null,
          email: session.user.email || null,
          username: session.user.username || null,
          role: (session.user.role as "job_seeker" | "recruiter") || null,
          companyName: session.user.companyName || null,
          companyLogo: session.user.companyLogo || null,
        })
      );
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    formData.append("folder", "company-logos");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploadingLogo(true);

    try {
      const logoUrl = await uploadToCloudinary(file);
      setValue("companyLogo", logoUrl);
      setLogoPreview(logoUrl);
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload logo. Please try again.");
      console.error("Logo upload error:", error);
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setValue("companyLogo", "");
    setLogoPreview("");
  };

  const onSubmit = async (data: FormData) => {
    setError("");

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
            await update();
            handleUserDispatch();

            toast.success("Registered successfully");
            reset();
            setLogoPreview("");
            router.push("/");
          } else {
            setError("Registration failed.");
          }
        } else if (response?.error) {
          setError(response.error);
        } else {
          setError("Registration failed");
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
          await update();
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

            {/* Conditionally show company fields for recruiters */}
            {selectedRole === "recruiter" && (
              <>
                <input
                  {...register("companyName")}
                  type="text"
                  placeholder="Company Name"
                  required
                  className="w-full p-2 border rounded"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  
                  {!logoPreview ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`w-full p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors flex flex-col items-center justify-center ${
                          uploadingLogo ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          {uploadingLogo ? "Uploading..." : "Upload Company Logo"}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 5MB
                        </span>
                      </label>
                    </div>
                  ) : (
  <div className="mt-4 relative w-24 h-24">
    <Image
      src={logoPreview}
      alt="Company Logo Preview"
      width={100}
      height={100}
      className="w-full h-full object-cover rounded border"
    />
    <button
      type="button"
      onClick={removeLogo}
      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
    >
      <X size={14} />
    </button>
  </div>

                  )}
                </div>
              </>
            )}
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
          disabled={uploadingLogo}
          className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadingLogo ? "Uploading..." : type === "signin" ? "Sign in" : "Register"}
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