import React from "react";
import HowTo from "@/components/sections/HowTo";
import Main from "@/components/sections/Main";
import AIRecognition from "@/components/sections/AIRecognition";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Main />
      <HowTo />
      <AIRecognition />
      <CTA />
    </main>
  );
}
