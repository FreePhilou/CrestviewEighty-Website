import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="bg-hero-pattern bg-cover bg-center text-white text-center py-32 min-h-[70vh] flex items-center justify-center">
      <div className="hero-content max-w-4xl mx-auto px-5">
        <h2 className="text-5xl md:text-6xl mb-5 font-bold drop-shadow-lg">
          Welcome to Crestview Eighty
        </h2>
        <p className="text-xl md:text-2xl mb-4 drop-shadow-md">
          A premier community nestled in the heart of Bigfork, Montana
        </p>
        <p className="text-lg opacity-90 max-w-2xl mx-auto drop-shadow-sm">
          Experience mountain living at its finest with stunning views of Flathead Lake and the surrounding wilderness
        </p>
      </div>
    </section>
  );
};

export default Hero;