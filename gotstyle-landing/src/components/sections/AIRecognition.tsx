import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const AIRecognition: FC = ({}) => {
  return (
    <section className="h-screen w-full border-none bg-gradient-to-b from-black to-[#0F0F0F] flex items-center justify-center">
      <div className="px-10 md:space-x-20 flex flex-col md:flex-row justify-center items-center">
        {/* Text Content */}
        <div className="w-full md:w-2/4" data-aos="fade-in">
          <h2 className="font-bas-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-white">
            Ensuring Authenticity, One Outfit at a Time 💥
          </h2>
          <p className="font-bas-reg text-sm mb-4 text-gray-300">
            Love browsing through outfits? So do we. That's why we make sure the
            feed stays true to its purpose.
          </p>
          <p className="font-bas-reg text-sm mb-4 hidden md:flex text-gray-300">
            Our AI validates that every image uploaded is indeed an outfit,
            maintaining the integrity of your fashion-focused feed.
          </p>
          <p className="font-bas-reg text-sm text-gray-300">
            Simply upload your outfit and let our AI ensure it's in the right
            company.
          </p>
        </div>

        {/* Image */}
        <div
          className="w-full md:w-1/3 flex flex-col items-center justify-center mt-5 md:mt-auto"
          data-aos="fade-in"
        >
          <p className="text-gray-500 font-bas-reg hidden md:flex">
            Good example of approved outfit
          </p>
          <Image
            src="/outfit-mirror.jpg"
            alt="Example of outfit recognition"
            width={350}
            height={450}
            className="rounded-xl"
          />
          <Link
            href="/ai"
            className="bg-white text-black font-bas-semi rounded-full px-6 py-2 mt-5 hover:-translate-y-1 transition-transform duration-200"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AIRecognition;
