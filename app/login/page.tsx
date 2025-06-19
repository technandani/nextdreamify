"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import Link from "next/link";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: loginUser, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/create");
    }
  }, [isLoggedIn, router]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          "/api/users/loginWithGoogle",
          { rowtoken: tokenResponse.access_token },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const { success, token, name, message } = response.data;
        if (success) {
          Cookies.set("uid", token, { expires: 5 });
          Cookies.set("loggedInUser", name, { expires: 5 });
          loginUser();
          toast.success("Login successful!");
          router.push("/create");
        } else {
          toast.error(message || "Login failed. Please try again.");
        }
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(error.response?.data?.message || "Something went wrong.");
      }
    },
    onError: () => toast.error("Google login failed. Please try again."),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/users/login",
        { email, password },
        { withCredentials: true }
      );
      const { success, token, name, message } = response.data;
      if (success) {
        Cookies.set("uid", token, { expires: 5 });
        Cookies.set("loggedInUser", name, { expires: 5 });
        loginUser();
        toast.success("Login successful!");
        setEmail("");
        setPassword("");
        router.push("/create");
      } else {
        toast.error(message || "Login failed. Please try again.");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="loginContainer">
        <form onSubmit={handleSubmit} className="px-8 py-6 rounded-lg w-lg">
          <div className="mb-4 flex flex-col gap-2">
            <h2 className="text-3xl font-bold">Welcome to Dreamify</h2>
            <p className="text-gray-400 text-md">
              Sign in to Dreamify and turn your imagination into beautiful,
              unique images
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                // placeholder="Enter email..."
                className="w-full h-10 rounded border text-white px-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                minLength={8}
                required
                // placeholder="Enter password..."
                className="w-full h-10 rounded border text-white px-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="authInput">
              {loading ? (
                <button className="bg-[#253b50] w-full text-white px-4 py-2 rounded">Loading...</button>
              ) : (
                <button
                  className="mt-2 !bg-[#253b50] w-full text-white px-4 py-2 rounded"
                  type="submit"
                >
                  SignIn
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 !p-4">
            <span>New to Dreamify?</span>
            <Link
              href="/register"
              className="text-yellow-400 font-semibold cursor-pointer"
            >
              <span>SignUp</span>
            </Link>
          </div>
          <div className="flex justify-center items-center w-full cursor-pointer">
            <div
              className="flex border gap-2 rounded-full px-6 py-2 w-fit"
              onClick={() => login()}
            >
              <Image
                src="/images/google.png"
                alt="Google"
                width={24}
                height={24}
              />
              <div className="google">SignIn with Google</div>
            </div>
          </div>
        </form>
      </div>
      <Toaster richColors position="bottom-right" theme="dark" />
    </>
  );
};

export default Login;
