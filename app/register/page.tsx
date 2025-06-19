"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("../../components/Navbar"), { ssr: false });
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isLoggedIn, login: loginUser } = useAuth();

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
          loginUser();
          Cookies.set("uid", token, { expires: 5 });
          Cookies.set("loggedInUser", name, { expires: 5 });
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
    if (!name || !email || !password) {
      toast.error("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      setLoading(true);
      const response = await axios.post("/api/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setProfilePic(null);
      router.push("/login");
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
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="px-8 py-6 rounded-lg w-lg"
        >
          <div className="mb-4 flex flex-col gap-2">
            <h2 className="text-3xl font-bold">Welcome to Dreamify</h2>
            <p className="text-gray-400 text-md">
              Sign up to Dreamify and turn your imagination into beautiful,
              unique images
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                // placeholder="Enter name..."
                className="w-full h-10 rounded border text-white px-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                required
                minLength={8}
                // placeholder="Enter password..."
                className="w-full h-10 rounded border text-white px-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h2>Profile Picture</h2>
              <input
                type="file"
                className="w-full h-10 rounded border text-white px-2"
                onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
              />
            </div>
            <div className="">
              {loading ? (
                <button className="bg-[#253b50] w-full text-white px-4 py-2 rounded">Loading...</button>
              ) : (
                <button
                  className="bg-[#253b50] w-full text-white px-4 py-2 rounded"
                  type="submit"
                >
                  Sign Up
                </button>
              )}
            </div>
            <div className="flex justify-center items-center gap-2 p-2">
              <span>Already have an account?</span>
              <Link
                href="/login"
                className="text-yellow-400 font-semibold cursor-pointer"
              >
                SignIn
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
          </div>
        </form>
      </div>
      <Toaster richColors position="bottom-right" theme="dark" />
    </>
  );
};

export default Register;
