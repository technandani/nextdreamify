'use client';
import React, { useState, useEffect } from 'react';
import Scrollbar from './Scrollbar';
import { ContentItem } from '../types';

const content: ContentItem[] = [
  {
    title: "Create Stunning AI Art with Dreamify",
    paragraph:
      "Generate unique images with Dreamify's AI-powered tools. Whether you're creating fantasy scenes or realistic portraits, Dreamify helps you turn your ideas into captivating art with just a few words.",
    image: "/images/6.jpg",
  },
  {
    title: "Bring Your Imagination to Life",
    paragraph:
      "Fuel your creativity with Dreamify. Simply input a text prompt, and let the AI image generator transform your vision into reality. Perfect for artists, designers, and anyone looking to explore their creative potential.",
    image: "/images/2.jpg",
  },
  {
    title: "AI-Powered Art Generator",
    paragraph:
      "Dreamify allows you to create beautiful, unique images from simple text prompts. Let AI bring your ideas to life instantly, making it easy to generate art for any purpose—whether personal or professional.",
    image: "/images/3.jpg",
  },
  {
    title: "AI Art Made Easy",
    paragraph:
      "Transform your ideas into stunning images with Dreamify’s AI-powered generator. Simply type a short prompt, and watch as the AI brings your creative vision to life instantly.",
    image: "/images/4.jpg",
  },
  {
    title: "Imagination Meets Innovation",
    paragraph:
      "Dreamify blends cutting-edge AI technology with your creativity. See your wildest ideas take shape through art, powered by the latest in artificial intelligence.",
    image: "/images/5.jpg",
  },
  {
    title: "Create with Dreamify",
    paragraph:
      "Dreamify turns your ideas into stunning artwork in no time. With just a few words, the AI generates detailed, unique images, making art creation simple and accessible to everyone, regardless of skill level.",
    image: "/images/1.jpeg",
  },
  {
    title: "Create Art Instantly",
    paragraph:
      "Dreamify makes it simple to create beautiful artwork in seconds. Just input a text prompt, and our AI will generate a unique image, perfect for any project—no artistic skills required.",
    image: "/images/7.jpg",
  },
  {
    title: "Unleash Your Creativity",
    paragraph:
      "Dreamify empowers you to create unique images from any idea. Whether you're designing characters or generating abstract art, our AI makes the process quick, easy, and accessible to everyone.",
    image: "/images/8.jpg",
  },
  {
    title: "Unleash Your Creativity",
    paragraph:
      "Dreamify empowers you to create unique images from any idea. Whether you're designing characters or generating abstract art, our AI makes the process quick, easy, and accessible to everyone.",
    image: "/images/9.jpg",
  },
  // {
  //   title: "Unleash Your Creativity",
  //   paragraph:
  //     "Dreamify empowers you to create unique images from any idea. Whether you're designing characters or generating abstract art, our AI makes the process quick, easy, and accessible to everyone.",
  //   image: "/images/10.png",
  // },
  {
    title: "Unleash Your Creativity",
    paragraph:
      "Dreamify empowers you to create unique images from any idea. Whether you're designing characters or generating abstract art, our AI makes the process quick, easy, and accessible to everyone.",
    image: "/images/11.jpg",
  },
];

const HeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="relative h-[70vmin] w-full overflow-hidden">
        {content.map((item, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 h-full w-full bg-cover bg-center transition-all duration-[1.5s] ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 min-w-[90vw] md:min-w-0">
              <h1
                className="text-3xl md:text-5xl font-bold mb-4 animate-[fadeInDown_2s_ease] [text-shadow:0_1px_4px_rgba(0,0,0,0.76)]"
              >
                {item.title}
              </h1>
              <p
                className="text-base md:text-xl mb-8 animate-[fadeInUp_2s_ease] [text-shadow:0_1px_4px_rgba(0,0,0,0.78)]"
              >
                {item.paragraph}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Scrollbar />
    </>
  );
};

export default HeroSection;