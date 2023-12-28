"use client";

import React, { FC } from "react";
import Image from "next/image";
import Apple from "@/components/icons/Apple";

const CTA: FC = () => {
  return (
    <section className="w-screen py-20 flex flex-col items-center justify-center bg-gradient-to-b from-[#0F0F0F] to-black">
      <div className="text-center" data-aos="fade-in">
        <h2 className="font-bas-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-white">
          Get GotStyle Now! 👕👗
        </h2>
        <p className="font-bas-reg text-sm mb-4 text-gray-300">
          Unleash your style potential.
        </p>
      </div>
      <div
        className="flex mt-5 flex-row items-center justify-center"
        data-aos="fade-in"
      >
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
      <Image
        src="/qr-code.png"
        className="rounded-md mt-5"
        alt="QR Code"
        width={200}
        height={200}
        data-aos="fade-in"
      />
    </section>
  );
};

export default CTA;
