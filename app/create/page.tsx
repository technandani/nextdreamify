"use client";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Navbar from "../../components/Navbar";
import FileSaver from "file-saver";
import Modal from "../../components/Modal";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import { RectangleHorizontal, RectangleVertical, Square } from "lucide-react";

const Create: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState<number>(512);
  const [height, setHeight] = useState<number>(512);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState("1:1");

  const [style, setStyle] = useState("default");

  const styleOptions = [
    {
      value: "default",
      label: "Default",
      description: "Balanced, general-purpose image style",
    },
    {
      value: "realistic",
      label: "Realistic",
      description: "Looks like a real photograph, perfect for lifelike scenes",
    },
    {
      value: "cartoon",
      label: "Cartoon",
      description: "Bright, playful, bold outlines like animated shows",
    },
    {
      value: "digital-art",
      label: "Digital Art",
      description: "Stylish modern art, great for fantasy or sci-fi scenes",
    },
    {
      value: "anime",
      label: "Anime",
      description:
        "Japanese manga style with vibrant and expressive characters",
    },
    {
      value: "sketch",
      label: "Sketch",
      description: "Hand-drawn pencil style, black and white or line art",
    },
    {
      value: "oil-painting",
      label: "Oil Painting",
      description: "Classic textured canvas look, rich in color and depth",
    },
    {
      value: "cyberpunk",
      label: "Cyberpunk",
      description: "Futuristic, neon-lit city vibes with tech aesthetics",
    },
    {
      value: "watercolor",
      label: "Watercolor",
      description: "Soft, artistic style with paint-like color flow",
    },
    {
      value: "pixel-art",
      label: "Pixel Art",
      description: "Retro video game style, low-res pixel blocks",
    },
  ];

  const dimensionOptions = [
    "512",
    "640",
    "800",
    "1024",
    "1280",
    "1536",
    "2048",
  ];

  const aspectRatios = [
    { id: "1:1", label: "1:1", icon: Square, width: 512, height: 512 },
    {
      id: "16:9",
      label: "16:9",
      icon: RectangleHorizontal,
      width: 768,
      height: 432,
    },
    {
      id: "9:16",
      label: "9:16",
      icon: RectangleVertical,
      width: 432,
      height: 768,
    },
    { id: "4:3", label: "4:3", icon: Square, width: 640, height: 480 },
    { id: "3:4", label: "3:4", icon: Square, width: 480, height: 640 },
  ];

  const setAspectRatio = (ratio: string) => {
    const selected = aspectRatios.find((r) => r.id === ratio);
    if (selected) {
      setWidth(selected.width);
      setHeight(selected.height);
    }
    setSelectedAspect(ratio);
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWidth(e.target.value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHeight(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      toast.error("Please enter a prompt.");
      return;
    }

    setGenerating(true);
    try {
      const response = await axios.get(
        `/api/image?prompt=${encodeURIComponent(
          prompt
        )}&width=${width}&height=${height}&style=${encodeURIComponent(style)}`,
        { timeout: 30000 }
      );

      setGeneratedImage(response.data.imageUrl);
      // toast.success("Image generated successfully!");
    } catch (err: unknown) {
      console.error("Error generating image:", err);
      let message =
        "Failed to generate image. Please check your connection and try again.";

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 503) {
          message =
            "Image generation service is temporarily unavailable. Please try again later.";
        }
      }

      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePostImage = async () => {
    if (!generatedImage) {
      toast.error("Please generate an image first.");
      return;
    }

    if (isLoggedIn) {
      try {
        const token = getCookie("uid");
        if (!token) {
          toast.error("Authentication token not found. Please log in again.");
          setShowLoginModal(true);
          return;
        }

        await axios.post(
          "/api/posts",
          { url: generatedImage, prompt },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Post created successfully!");
        setPrompt("");
        setGeneratedImage(null);
        setWidth("800");
        setHeight("800");
      } catch (err: unknown) {
        console.error("Error posting image:", err);
        const message = axios.isAxiosError(err)
          ? "Failed to post image: " +
            (err.response?.data?.message || err.message)
          : "Failed to post image. Please try again.";

        toast.error(message);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar />
      <div className="flex mx-auto p-[30px]">
        <div className="flex items-center justify-evenly w-full gap-[30px] max-[699px]:flex-col-reverse">
          <div className="w-[90vmin] flex flex-col gap-2 max-[699px]:w-[92vmin] max-[699px]:p-0">
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-3xl font-bold">Generate image with prompt</h2>
              <p className="text-gray-300 text-lg">
                Create stunning images from your ideas instantly with Dreamify s
                powerful AI generator.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="input">
                  <div className="inputTitle">Image Prompt</div>
                  <textarea
                    value={prompt}
                    onChange={handlePromptChange}
                    className="border border-white h-[20vmin] w-full rounded-lg bg-transparent px-3 py-3"
                    placeholder="Enter your image prompt..."
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="inputTitle">Width</div>
                    <select
                      value={width}
                      onChange={handleWidthChange}
                      className="border border-white w-full rounded-lg bg-transparent px-3 py-3"
                    >
                      {dimensionOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-[#253b50]"
                        >
                          {option}px
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <div className="inputTitle">Height</div>
                    <select
                      value={height}
                      onChange={handleHeightChange}
                      className="border border-white w-full rounded-lg bg-transparent px-3 py-3"
                    >
                      {dimensionOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-[#253b50]"
                        >
                          {option}px
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <div>Aspect Ratio Presets</div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    {aspectRatios.map((ratio) => (
                      <div
                        key={ratio.id}
                        onClick={() => setAspectRatio(ratio.id)}
                        className={`h-auto py-2 px-2 gap-1 flex justify-center items-center rounded cursor-pointer
      ${
        selectedAspect === ratio.id
          ? "bg-white text-gray-900 border-none"
          : "hover:bg-gray-700 bg-gray-800 text-gray-300"
      }
    `}
                      >
                        <ratio.icon className="w-4 h-4 mr-1" />
                        {ratio.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="inputTitle">Style</div>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="border border-white w-full rounded-lg bg-transparent px-3 py-3"
                  >
                    {styleOptions.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-[#253b50] text-sm"
                        title={opt.description} // Tooltip on hover
                      >
                        {opt.label} — {opt.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="CreatePostBtns flex gap-4">
                  <button
                    type="submit"
                    className="CreatePostBtn text-xl bg-[#253b50] rounded-lg flex items-center gap-2 px-4 py-2"
                    disabled={generating}
                  >
                    <Image
                      src="/images/390.png"
                      alt="Generate"
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-[40px] w-auto"
                    />
                    {generating ? "Generating..." : "Generate Image"}
                  </button>
                  <button
                    type="button"
                    className="CreatePostBtn text-xl bg-orange-400 rounded-lg flex items-center gap-2 px-4 py-2"
                    onClick={handlePostImage}
                  >
                    <Image
                      src="/images/stars.png"
                      alt="Post"
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-[40px] w-auto"
                    />
                    Post Image
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="w-[75vmin] rounded-[20px] max-[699px]:w-full">
            <div className="createdImg p-2 rounded-lg min-w-2/2">
              {generatedImage ? (
                <div className="downloadBox">
                  <Image
                    src={generatedImage}
                    alt="Generated"
                    width={parseInt(width)}
                    height={parseInt(height)}
                    loading="lazy"
                    className="rounded-lg max-w-full max-h-[80vh] object-contain mx-auto"
                  />

                  <div
                    className="downloadBtn cursor-pointer"
                    onClick={() =>
                      FileSaver.saveAs(generatedImage, "download.jpg")
                    }
                  >
                    <div className="relative flex items-center justify-center">
                      <Image
                        src="/images/download.png"
                        alt="Download"
                        width={25}
                        height={25}
                        loading="lazy"
                        className="z-50 absolute !h-6 !w-auto top-[-40px] right-[30px]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="downloadBox min-w-full]">
                  <div className="downloadBtn flex items-center justify-center h-[65vmin] rounded-lg bg-[#253b50] text-lg">
                    Please generate an image to see Image!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <Modal
          onClose={handleCloseModal}
          onLoginRedirect={handleLoginRedirect}
        />
      )}
      <Toaster richColors position="bottom-right" theme="dark" />
    </>
  );
};

export default Create;
