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

const ImageCard: React.FC<ImageCardProps> = ({ post }) => {
  const secureUrl = post.url?.startsWith("http://")
    ? post.url.replace("http://", "https://")
    : post.url;
  const profilePicUrl = post.user?.profilePic?.startsWith("http://")
    ? post.user.profilePic.replace("http://", "https://")
    : post.user?.profilePic || "images/user.png";

  return (
    <div className="relative rounded-[15px] overflow-hidden group cursor-pointer transition-transform hover:scale-105">
      <LazyLoadImage
        src={secureUrl}
        alt="Generated image"
        className="w-full rounded-[15px]"
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 backdrop-blur-md bg-[#253b5070] transition-opacity p-5 flex flex-col justify-end gap-2">
        <p className="!text-sm md:text-base">{post.prompt}</p>
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <div className="h-6 w-6 rounded-full overflow-hidden bg-black flex items-center justify-center">
              <Image
                src={profilePicUrl}
                alt="Author"
                width={25}
                height={25}
                className="h-full max-w-[25px] object-cover"
              />
            </div>
            <div className="!text-sm">{post.user?.name || "Unknown"}</div>
          </div>
          <button onClick={() => FileSaver.saveAs(post.url, "download.jpg")}>
            <ArrowDownToLine size={22} absoluteStrokeWidth />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;