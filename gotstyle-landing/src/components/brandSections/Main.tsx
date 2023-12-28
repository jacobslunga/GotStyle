"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";

const Main: FC = ({}) => {
  const [scrollY, setScrollY] = useState(0);
  let windowHeight = 0;
  let windowWidth = 0;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (typeof window !== "undefined") {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
  }

  return (
    <section className="h-screen w-screen bg-gradient-to-tr from-[#FFA1F5] to-[#FF9B82] flex flex-col md:flex-row items-center justify-center">
      <div
        style={{
          transform: `translateY(-${scrollY * 0.6}px)`,
          opacity: 1 - scrollY / 1000,
        }}
        className="flex flex-col items-center justify-center z-40"
      >
        <h1 className="z-40 tracking-tighter text-transparent font-bas-bold bg-clip-text bg-gradient-to-r from-black to-gray-800 text-5xl md:text-6xl lg:text-7xl">
          Be The <span className="underline">Trend</span>
        </h1>
        <div className="flex flex-row items-center justify-center mt-10">
          <Link
            href="/brands-get-started"
            className="bg-white hover:scale-105 duration-200 transition-transform px-5 group py-2 flex flex-row items-center justify-center rounded-full text-black tracking-tight font-bas-semi"
          >
            Get Started
            <MoveRight
              size={24}
              className="ml-2 group-hover:translate-x-1 duration-200 transition-transform"
            />
          </Link>
          <span className="text-white font-bas-reg ml-5">or</span>
          <button
            onClick={() => {
              window.scrollTo({
                top: windowHeight,
                behavior: "smooth",
              });
            }}
            className="text-white py-2 px-5 font-bas-med ml-5"
          >
            Read More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Main;
