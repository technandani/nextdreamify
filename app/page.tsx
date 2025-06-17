"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import Link from "next/link";
import Navbar from "../components/Navbar";
import ImageCard from "../components/ImageCard";
import Loader from "../components/Loader";
import ScrollToTop from "../components/ScrollToTop";
import HeroSection from "../components/HeroSection";
import { useSearch } from "../context/SearchContext";
import { Post } from "../types";
import { Search, Send } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filterPosts, setFilterPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { search, setSearch } = useSearch();


const fetchImages = async () => {
  setLoading(true);
  try {
    const res = await axios.get("/api/posts");
    const data = Array.isArray(res.data) ? res.data : [];
    setPosts(data);
    setFilterPosts(data);
  } catch (err: unknown) {
    console.error("Error fetching posts:", err);
    const error = err as AxiosError<{ message?: string }>;
    toast.error(
      error.response?.data?.message || "Failed to load posts. Please try again."
    );
    setPosts([]);
    setFilterPosts([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilterPosts(posts);
      return;
    }
    const filtered = posts.filter(
      (post) =>
        post?.prompt?.toLowerCase().includes(search.toLowerCase()) ||
        post?.user?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilterPosts(filtered);
  }, [posts, search]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <div className="mainContainer max-w-7xl mx-auto p-8">
        <div className="searchContainer text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Explore popular posts in this community
            <div className="text-gray-400">@ created with AI @</div>
          </h2>
          <div className="searchBox flex items-center mt-4 bg-gray-700 rounded-lg p-2">
            <Search />
            <input
              type="search"
              placeholder="Search image by keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 bg-transparent text-white outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading ? (
            <div className="divLoader col-span-full flex justify-center pt-[25%] w-[98vw]">
              <Loader />
            </div>
          ) : filterPosts.length > 0 ? (
            filterPosts.map((post, index) => (
              <ImageCard key={index} post={post} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center w-[98vw]">
              {/* <img
                src="https://res.cloudinary.com/dpmengi5q/image/upload/v1735578462/noData_2_ohoj6z.png"
                alt="No Data"
                className="w-full max-w-xs h-auto"
              /> */}
              <Image
                src="https://res.cloudinary.com/dpmengi5q/image/upload/v1735578462/noData_2_ohoj6z.png"
                alt="No Data"
                width={300} // or appropriate width in pixels
                height={200} // adjust based on aspect ratio of your image
                className="w-full max-w-xs h-auto"
              />
              <h3 className="text-white mt-4 font-semibold">
                No results! Press &apos;Generate Image&apos; to craft your
                image.
              </h3>
              <Link
                href="/create"
                className="flex items-center justify-center gap-2 mt-10 !px-5 !py-2 text-lg text-white !mt-6 !mb-10 !border !border-white rounded-xl hover:bg-white/20 transition"
              >
                <Send size={20} />
                Generate Image
              </Link>
            </div>
          )}
        </div>
      </div>
      <ScrollToTop />
    </>
  );
};

export default Home;
