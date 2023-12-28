"use client";

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import Apple from "@/components/icons/Apple";

const Main: FC = ({}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="h-screen w-screen bg-gradient-to-b from-black via-black to-gray-600 flex flex-col md:flex-row items-center justify-evenly p-10">
      <div
        style={{
          transform: `translateY(-${scrollY * 0.4}px)`,
          opacity: 1 - scrollY / 1000,
        }}
        className="flex flex-col items-start justify-start"
      >
        <h1 className="font-bas-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 text-3xl md:text-4xl lg:text-5xl">
          Show It. Mean It.
        </h1>
        <p className="text-transparent text-base font-bas-reg bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 mt-3">
          The app where style is of the essence.
        </p>
        <div className="flex flex-row items-center justify-center">
          <Image
            src="/qr-code.png"
            className="rounded-md mt-3 hidden md:flex"
            alt="QR Code"
            width={200}
            height={200}
          />
          <Image
            src="/qr-code.png"
            className="rounded-md mt-3 flex md:hidden"
            alt="QR Code"
            width={150}
            height={150}
          />
          <Image
            priority
            src="https://gotstyle-bucket.s3.eu-central-1.amazonaws.com/app-mockup.png"
            alt="App Mockup"
            width={100}
            height={100}
            className="rotate-[15deg] flex md:hidden ml-10"
            style={{
              transform: `translateY(-${scrollY * 0.4}px) rotate(15deg)`,
              opacity: 1 - scrollY / 1000,
            }}
          />
        </div>
        <div className="flex mt-5 flex-row items-center justify-center">
          <button className="bg-white text-sm flex flex-row items-center justify-center transition-transform hover:-translate-y-1 duration-200 rounded-full px-2 md:px-5 py-2 text-black font-bas-semi">
            <div className="w-[20px] h-[20px] mr-2">
              <Apple />
            </div>
            Download App
          </button>
          <p className="text-transparent text-sm ml-5 font-bas-reg bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400">
            or
          </p>
          <p className="text-transparent text-sm ml-5 font-bas-semi bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400">
            Scan QR Code
          </p>
        </div>
      </div>
      <Image
        priority
        src="https://gotstyle-bucket.s3.eu-central-1.amazonaws.com/app-mockup.png"
        alt="App Mockup"
        width={300}
        height={300}
        className="rotate-[15deg] hidden md:flex"
        style={{
          transform: `translateY(-${scrollY * 0.4}px) rotate(15deg)`,
          opacity: 1 - scrollY / 1000,
        }}
      />
    </section>
  );
};

export default Main;
