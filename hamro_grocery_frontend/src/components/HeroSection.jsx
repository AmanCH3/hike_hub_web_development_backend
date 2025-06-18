import React from 'react';
import video from "../assets/banner.mp4";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen">
      <video 
        className="w-full h-full object-cover" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 flex items-center justify-center mt-50">
        <div className="flex items-center gap-4">
          <a 
            href="/products" 
            className="px-8 py-3 bg-primary text-white rounded hover:bg-primary-dull transition"
          >
            Shop Now
          </a>
          <a 
            href="/products" 
            className="px-8 py-3 bg-primary text-white rounded hover:bg-primary-dull transition"
          >
            Explore Deals
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;