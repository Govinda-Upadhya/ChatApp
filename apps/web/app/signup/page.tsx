"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const signUp: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await axios.post("http://localhost:3001/api/signup", data);
      reset();

      alert(res.data.message);
      router.push("/signin");
    } catch (error: any) {
      console.error("Signup error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred during signup.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Your Account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join the Chess Arena and play smarter.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(signUp)}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              {...register("username", {
                required: {
                  value: true,
                  message: "Username is required",
                },
              })}
              id="username"
              type="text"
              name="username"
              required
              placeholder="e.g. knight_master"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              id="email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              id="password"
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className={`w-full py-2 rounded-md text-sm font-medium transition
    ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
  `}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Note: This button uses router.push, which is fine, but if it's just a simple link, <Link> is generally preferred for prefetching and accessibility. */}
        <button
          onClick={() => router.push("/signin")}
          className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1H12v2.82h5.35c-.23 1.36-1.4 4-5.35 4a6 6 0 1 1 0-12 5.68 5.68 0 0 1 3.6 1.31l2.48-2.48A9.92 9.92 0 0 0 12 2a10 10 0 1 0 0 20c5.84 0 9.63-4.1 9.63-9.88 0-.68-.07-1.23-.18-1.76z" />
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
