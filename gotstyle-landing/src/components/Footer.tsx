import { FC } from "react";
import Link from "next/link";

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
  return (
    <footer className="w-screen z-50 bg-black py-20 px-2 lg:px-10 flex flex-row items-center justify-center">
      <Link href="/">
        <h1 className="font-bas-semi tracking-tight text-[rgba(255,255,255,0.4)] text-md md:text-lg lg:text-xl absolute left-2 md:left-10">
          GotStyle
        </h1>
      </Link>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <Link href="/privacy">
          <p className="text-[12px] mt-3 md:mt-0 text-[rgba(255,255,255,0.5)] hover:text-white underline font-bas-reg mr-0 md:mr-5">
            Privacy Policy
          </p>
        </Link>
        <Link href="/terms">
          <p className="text-[12px] mt-3 md:mt-0 text-[rgba(255,255,255,0.5)] hover:text-white underline font-bas-reg">
            Terms of Service
          </p>
        </Link>
      </div>
      <div className="flex flex-row items-center justify-center absolute right-2 md:right-10">
        <p className="text-[10px] text-[rgba(255,255,255,0.5)] font-bas-reg">
          © GotStyle 2023
        </p>
      </div>
    </footer>
  );
};

export default Footer;
