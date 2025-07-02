"use client";

import Navbar from "@/components/Navbar";
import React, { useCallback, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface Images {
  _id: string;
  url: string;
  prompt: string;
}

const Page = () => {
  const [images, setImages] = useState<Images[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback( async () => {
    try {
      const response = await fetch("/api/image?all=true");
      const data = await response.json();
      if (response.ok) {
        setImages(data);
        console.log("Fetched images:", data);
      } else {
        console.error("Failed to fetch images:", data);
        setImages([]);
      }
    } catch (error) {
      console.log("Error fetching images: ", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-3xl font-semibold m-4">Images</h2>

        {loading ? (
          <div>Loading...</div>
        ) : images && images.length > 0 ? (
          <div className="masonry">
            {images.map((image) => (
              <div key={image._id} className="masonry-item">
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer transition-transform hover:scale-105">
                  <LazyLoadImage
                    src={image?.url}
                    alt="Generated image"
                    className="w-full rounded-2xl object-cover"
                    placeholderSrc="/images/placeholder.png"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 backdrop-blur-md bg-[#253b5070] transition-opacity p-5 flex flex-col justify-end gap-2">
                    <p className="!text-xs md:text-base">
                      {image?.prompt || "No prompt available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No images found</div>
        )}
      </div>
    </>
  );
};

export default Page;
