"use client";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import FileSaver from "file-saver";
import { ArrowDownToLine } from "lucide-react";
import { Post } from "../types";
import Image from "next/image";

interface ImageCardProps {
  post: Post;
}

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getOptimizedUrl = (url: string | undefined) => {
  if (!isValidUrl(url)) return "/images/placeholder.png";
  const secure = url!.startsWith("http://") ? url!.replace("http://", "https://") : url!;
  // Cloudinary optimization
  return secure.includes("res.cloudinary.com")
    ? secure.replace("/upload/", "/upload/q_auto,f_auto/")
    : secure;
};

const ImageCard: React.FC<ImageCardProps> = ({ post }) => {
  const secureUrl = getOptimizedUrl(post.url);
  const profilePicUrl = getOptimizedUrl(post.user?.profilePic);

  return (
    <div className="relative rounded-[15px] overflow-hidden group cursor-pointer transition-transform hover:scale-105">
      <LazyLoadImage
        src={secureUrl}
        alt="Generated image"
        className="w-full rounded-[15px] object-cover"
        placeholderSrc="/images/placeholder.png"
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 backdrop-blur-md bg-[#253b5070] transition-opacity p-5 flex flex-col justify-end gap-2">
        <p className="!text-xs md:text-base">
          {post.prompt || "No prompt available"}
        </p>
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <div className="h-6 w-6 rounded-full overflow-hidden bg-black flex items-center justify-center">
              <Image
                src={profilePicUrl}
                alt="Author"
                width={24}
                height={24}
                loading="lazy"
                className="rounded-full h-full w-full object-cover"
              />
            </div>
            <div className="!text-sm truncate max-w-[100px]">
              {post.user?.name || "Unknown"}
            </div>
          </div>
          <button
            onClick={() => isValidUrl(post.url) && FileSaver.saveAs(post.url, "download.jpg")}
            disabled={!isValidUrl(post.url)}
            className="hover:scale-105 transition-transform"
          >
            <ArrowDownToLine size={20} absoluteStrokeWidth />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;