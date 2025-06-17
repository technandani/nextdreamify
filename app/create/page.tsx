"use client";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Navbar from "../../components/Navbar";
import FileSaver from "file-saver";
import Modal from "../../components/Modal";
import { Toaster, toast } from "sonner";
import Image from "next/image";

const Create: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
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
        `/api/image?prompt=${encodeURIComponent(prompt)}`,
        {
          timeout: 30000,
        }
      );
      setGeneratedImage(response.data.imageUrl);
      toast.success("Image generated successfully!");
    } catch (err: unknown) {
      console.error("Error generating image:", err);
      const message =
        err.response?.status === 503
          ? "Image generation service is temporarily unavailable. Please try again later."
          : "Failed to generate image. Please check your connection and try again.";
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
      <Toaster richColors position="top-right" theme="dark" />
      <Navbar />
      <div className="flex mx-auto p-[30px]">
        <div className="flex items-center justify-evenly w-full gap-[30px] max-[699px]:flex-col-reverse">
          <div className="w-[90vmin] p-[15px] flex flex-col gap-[30px] max-[699px]:w-[92vmin] max-[699px]:p-0">
            <div className="title">
              <h2>Generate image with prompt</h2>
              <p>
                Create stunning images from your ideas instantly with
                Dreamify&apos;s powerful AI generator.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="input">
                  <div className="inputTitle">Image Prompt</div>
                  <textarea
                    value={prompt}
                    onChange={handlePromptChange}
                    className="border border-white h-[30vmin] w-full rounded-lg bg-transparent px-3 py-3"
                  ></textarea>
                </div>
                <div className="CreatePostBtns">
                  <button
                    type="submit"
                    className="CreatePostBtn bg-[#253b50] rounded-lg"
                    disabled={generating}
                  >
                    {/* <img src="/images/390.png" alt="Generate" className='h-[40px]' /> */}

                    <Image
                      src="/images/390.png"
                      alt="Generate"
                      width={40}
                      height={40}
                      className="h-[40px] w-auto"
                    />

                    {generating ? "Generating..." : "Generate Image"}
                  </button>
                  <button
                    type="button"
                    className="CreatePostBtn bg-orange-400 rounded-lg"
                    onClick={handlePostImage}
                  >
                    {/* <img
                      src="/images/stars.png"
                      alt="Post"
                      className="h-[40px]"
                    /> */}
                    <Image
                      src="/images/stars.png"
                      alt="Post"
                      width={40}
                      height={40}
                      className="h-[40px] w-auto"
                    />
                    Post Image
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="w-[75vmin] rounded-[20px] max-[699px]:w-full">
            <div className="createdImg p-2 rounded-lg">
              {generatedImage ? (
                <div className="downloadBox">
                  {/* <img
                    src={generatedImage}
                    alt="Generated"
                    className="rounded-lg w-full z-10"
                  /> */}
                  <Image
                    src={generatedImage}
                    alt="Generated"
                    width={300}
                    height={200}
                    className="rounded-lg w-full z-10"
                  />
                  <div
                    className="downloadBtn cursor-pointer"
                    onClick={() =>
                      FileSaver.saveAs(generatedImage, "download.jpg")
                    }
                  >
                    <div className="relative flex items-center justify-center">
                      {/* <img
                        src="/images/download.png"
                        alt="Download"
                        className="z-50 "
                        style={{
                          height: "25px",
                          width: "auto",
                          position: "absolute",
                          top: "-50px",
                          right: "30px",
                        }}
                      /> */}
                      <Image
                        src="/images/download.png"
                        alt="Download"
                        width={25}
                        height={25}
                        className="z-50 absolute !h-6 !w-auto top-[-40px] right-[30px]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="downloadBox">
                  {/* <img src='https://res.cloudinary.com/dpmengi5q/image/upload/v1735566750/image_2_cmhkfh.png' alt="Generated" className='rounded-lg w-full z-10' /> */}
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
    </>
  );
};

export default Create;
