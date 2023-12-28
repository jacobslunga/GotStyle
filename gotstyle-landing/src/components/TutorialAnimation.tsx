"use client";

import React, { useEffect } from "react";

interface TutorialAnimationProps {
  currentImage: number;
  setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

const TutorialAnimation: React.FC<TutorialAnimationProps> = ({
  currentImage,
  setCurrentImage,
  isPaused,
  setIsPaused,
}) => {
  const images = ["/start.png", "/outfit.png", "/shoes.png", "/upload.png"];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isPaused) {
      timer = setTimeout(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [currentImage, isPaused]);

  return (
    <div
      className="tutorial-animation"
      style={{ position: "relative", width: "300px", height: "300px" }}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt="Tutorial Step"
          style={{
            position: "absolute",
            opacity: index === currentImage ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
    </div>
  );
};

export default TutorialAnimation;
