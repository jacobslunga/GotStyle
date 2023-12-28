"use client";

import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const pathname = usePathname();

  return (
    <div
      className={`w-screen z-50 ${
        pathname === "/brands" ? "bg-white" : "bg-black"
      } fixed top-0 h-[8%] flex flex-row items-center justify-center`}
    >
      <Link href="/" className="absolute left-5">
        <h1
          className={`font-logo ${
            pathname === "/brands" ? "text-black" : "text-gray-200"
          } text-xl`}
        >
          GotStyle
        </h1>
      </Link>
      <div className="flex flex-row items-center justify-center">
        <Link
          href="/ai"
          className={`${
            pathname === "/brands"
              ? "text-gray-700 hover:text-black"
              : "text-gray-400 hover:text-white"
          } font-bas-med text-sm duration-300 mr-2 cool-link`}
        >
          The AI
        </Link>
        <p>
          <span className="text-gray-400 font-bas-reg mr-2 ml-2">|</span>
        </p>
        <Link
          href="/about"
          className={`${
            pathname === "/brands"
              ? "text-gray-700 hover:text-black"
              : "text-gray-400 hover:text-white"
          } font-bas-med text-sm duration-300 mr-2 cool-link`}
        >
          About Us
        </Link>
        <p>
          <span className="text-gray-400 font-bas-med mr-2 ml-2">|</span>
        </p>
        <Link
          href="/trending"
          className={`${
            pathname === "/brands"
              ? "text-gray-700 hover:text-black"
              : "text-gray-400 hover:text-white"
          } font-bas-med text-sm duration-300 mr-2 cool-link`}
        >
          Trending
        </Link>
      </div>
      <div className="flex flex-row items-center justify-center absolute right-5">
        <Link
          className={`${
            pathname === "/brands"
              ? "text-white bg-black"
              : "text-black bg-white"
          } mr-2 font-bas-med text-sm flex hover:scale-105 transition-transform duration-200 flex-row items-center justify-center rounded-full px-5 py-2`}
          href="mailto:info@gotstyle.app"
        >
          Contact
        </Link>
        <Link
          className="text-white mr-2 font-bas-med text-sm flex hover:scale-105 transition-transform duration-200 flex-row items-center justify-center bg-gradient-to-tr from-[#FFA1F5] to-[#FF9B82] backdrop-blur-sm rounded-full px-5 py-2"
          href="/brands"
        >
          For Brands
        </Link>
      </div>
    </div>
  );
};

export default Header;
