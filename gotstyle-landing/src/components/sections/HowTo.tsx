"use client";

import { FC, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

const HowTo: FC = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 500,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);

  return (
    <section className="min-h-screen py-20 max-w-[100vw] w-screen bg-gradient-to-b from-white via-gray-400 to-black flex flex-col items-start justify-start">
      <div className="flex flex-col items-center justify-center max-w-[100vw]">
        <div
          className="flex flex-row items-center justify-center"
          data-aos="fade-up"
        >
          <h2 className="font-bas-bold z-40 h-20 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 text-3xl md:text-4xl lg:text-5xl">
            The ABCs of GotStyle
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center mt-10">
          {/* Show It Mean It Button */}
          <div className="flex w-screen px-20 flex-col md:flex-row items-center justify-center">
            <Image
              src="/start.png"
              alt="Show It Mean It"
              width={250}
              height={250}
              className="hidden md:flex"
            />
            <Image
              src="/start.png"
              alt="Show It Mean It"
              width={150}
              height={150}
              className="flex md:hidden"
            />
            <div
              style={{
                transition: "opacity 1s ease-in-out",
              }}
              className="flex flex-col items-start justify-start"
            >
              <div className="rounded-full w-[50px] h-[50px] flex flex-row items-center justify-center border-2 border-gray-500">
                <p className="font-bas-bold text-gray-500 text-3xl">1.</p>
              </div>
              <h3
                style={{
                  transition: "opacity 1s ease-in-out",
                }}
                className="font-bas-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 text-xl md:text-2xl lg:text-3xl"
              >
                Click "Show It Mean It"
              </h3>
              <p
                style={{
                  transition: "opacity 1s ease-in-out",
                }}
                className="text-transparent font-bas-reg bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700 mt-3"
              >
                This will take you to the camera screen.
              </p>
            </div>
          </div>

          {/* Take a Outfit Button */}
          <div className="flex flex-col mt-5 lg:mt-auto md:flex-row w-screen px-20 items-center justify-center">
            <Image
              src="/outfit.png"
              alt="Take a Outfit"
              width={150}
              height={150}
              className="flex md:hidden"
            />
            <div
              style={{
                transition: "opacity 1s ease-in-out",
              }}
            >
              <div className="rounded-full w-[50px] h-[50px] flex flex-row items-center justify-center border-2 border-gray-200">
                <p className="font-bas-bold text-gray-200 text-3xl">2.</p>
              </div>
              <h3
                style={{
                  transition: "opacity 1s ease-in-out",
                }}
                className="font-bas-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 text-xl md:text-2xl lg:text-3xl"
              >
                Take a picture of your outfit
              </h3>
              <p
                style={{
                  transition: "opacity 1s ease-in-out",
                }}
                className="text-transparent font-bas-reg bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300 mt-3"
              >
                Make sure to take a picture of your outfit in a well lit area.
              </p>
            </div>
            <Image
              src="/outfit.png"
              alt="Take a Outfit"
              width={250}
              height={250}
              className="hidden md:flex"
            />
          </div>

          {/* Take a Shoes Button */}
          <div className="flex w-screen flex-col mt-5 lg:mt-auto md:flex-row px-20 items-center justify-center">
            <Image
              src="/shoes.png"
              alt="Take a Shoes"
              width={250}
              height={250}
              className="hidden md:flex"
            />
            <Image
              src="/shoes.png"
              alt="Take a Shoes"
              width={150}
              height={150}
              className="flex md:hidden"
            />
            <div
              style={{
                transition: "opacity 1s ease-in-out",
              }}
            >
              <div className="rounded-full w-[50px] h-[50px] flex flex-row items-center justify-center border-2 border-gray-100">
                <p className="font-bas-bold text-gray-100 text-3xl">3.</p>
              </div>
              <h3
                style={{
                  transition: "opacity 1s ease-in-out",
                }}
                className="font-bas-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 text-xl md:text-2xl lg:text-3xl"
              >
                Take a picture of your shoes (or not)
              </h3>
              <p
                style={{
                  transition: "opacity 1s ease-in-out",
                }}
                className="text-transparent font-bas-reg bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mt-3"
              >
                Make sure to take a picture of your shoes in a well lit area.
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex px-20 w-screen max-w-[100vw] mt-5 lg:mt-auto flex-col md:flex-row items-center justify-center">
            <Image
              src="/upload.png"
              alt="Upload"
              width={150}
              height={150}
              className="flex md:hidden"
            />
            <div
              style={{
                transition: "opacity 1s ease-in-out",
              }}
            >
              <div className="rounded-full w-[50px] h-[50px] flex flex-row items-center justify-center border-2 border-white">
                <p className="font-bas-bold text-white text-3xl">4.</p>
              </div>
              <h3
                style={{
                  transition: "opacity 1s ease-in-out",
                }}
                className="font-bas-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 text-xl md:text-2xl lg:text-3xl"
              >
                Upload your outfit
              </h3>

              <p
                style={{
                  transition: "opacity 1s ease-in-out",
                }}
                className="text-transparent font-bas-reg bg-clip-text bg-gradient-to-r from-gray-50 to-gray-200 mt-3"
              >
                Upload your outfit to the app! That's it!
              </p>
            </div>
            <Image
              src="/upload.png"
              alt="Upload"
              width={250}
              height={250}
              className="hidden md:flex"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowTo;
