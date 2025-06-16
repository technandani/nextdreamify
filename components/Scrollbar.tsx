'use client';
import React, { useEffect, useRef } from 'react';
import { useSearch } from '../context/SearchContext';
import { ScrollbarItem } from '../types';

const data: ScrollbarItem[] = [
  { img: "images/nature.jpg", text: "Nature" },
  { img: "images/forest.jpg", text: "Forest" },
  { img: "images/technology.jpg", text: "Technology" },
  { img: "images/glaxey.jpg", text: "Galaxy" },
  { img: "images/planet.jpg", text: "planet" },
  { img: "images/girl.jpeg", text: "girl" },
  { img: "images/snow.jpg", text: "snow" },
  { img: "images/deepSpace.jpg", text: "Space" },
  { img: "images/peacock.jpg", text: "peacock " },
  { img: "images/moon.jpg", text: "Moon" },
  { img: "images/boy.jpg", text: "boy" },
  { img: "images/alien.jpg", text: "alien" },
  { img: "images/4.jpg", text: "spaceship" },
  { img: "images/garden.jpg", text: "garden" },
  { img: "images/painting.jpg", text: "painting" },
  { img: "images/fairy.png", text: "Fairy" },
  { img: "images/horror.jpg", text: "Horror" },
  { img: "images/fantasy.jpg", text: "Fantasy" },
  { img: "images/travel.jpeg", text: "Travel" },
  { img: "images/laptop.jpg", text: "Laptop" },
  { img: "images/night.jpg", text: "Night" },
  { img: "images/ocean.jpg", text: "Ocean " },
  { img: "images/fish.jpg", text: "Fish" },
  { img: "images/flower.jpg", text: "Flower" },
  { img: "images/village.jpg", text: "Village" },
  { img: "images/farmer.jpg", text: "Farmer" },
  { img: "images/rain.jpg", text: "Rain" },
  { img: "images/blackHole.jpg", text: "Black Hole" },
];


const Scrollbar: React.FC = () => {
  const { setSearch } = useSearch();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = scrollContainer.current;
    const scrollSpeed = 1;

    const startScrolling = () => {
      scrollIntervalRef.current = setInterval(() => {
        if (container) {
          container.scrollLeft += scrollSpeed;
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0;
          }
        }
      }, 20);
    };

    const stopScrolling = () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };

    startScrolling();
    return () => stopScrolling();
  }, []);

  const handleMouseEnter = () => {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
  };

  const handleMouseLeave = () => {
    const container = scrollContainer.current;
    const scrollSpeed = 1;
    scrollIntervalRef.current = setInterval(() => {
      if (container) {
        container.scrollLeft += scrollSpeed;
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }
    }, 20);
  };

  return (
    <div
      ref={scrollContainer}
      className="flex items-center gap-5 overflow-x-auto whitespace-nowrap p-5 h-[100px] rounded-lg scroll-container"
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="h-[50px] min-w-[150px] bg-cover bg-center rounded-lg flex items-center justify-center text-white font-bold cursor-pointer shadow-[0_0_1px_#fff] backdrop-blur-md bg-[#253b5070] hover:scale-105 hover:shadow-[0_0_5px_rgba(255,255,255,0.2)] transition-all"
          style={{ backgroundImage: `url(${item.img})` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setSearch(item.text)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default Scrollbar;