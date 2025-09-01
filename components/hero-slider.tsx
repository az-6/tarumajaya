"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideData {
  id: number;
  image: string;
  title: string;
  description: string;
  alt: string;
}

const heroSlides: SlideData[] = [
  {
    id: 1,
    image: "/3.jpg",
    title: "Bale Kertasarie",
    description: "",
    alt: "",
  },
  {
    id: 2,
    image: "/2.jpg",
    title: "Bale Kertasarie",
    description: "",
    alt: "",
  },
  {
    id: 3,
    image: "/1.jpg",
    title: "Bale Kertasarie",
    description: "",
    alt: "",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlay(false); // Stop auto-play when user manually navigates
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlay(false); // Stop auto-play when user manually navigates
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false); // Stop auto-play when user manually navigates
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl group">
      {/* Main slider container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroSlides.map((slide) => (
          <div key={slide.id} className="relative w-full h-full flex-shrink-0">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority={slide.id === 1}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="max-w-4xl mx-auto text-white">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{
            width: isAutoPlay
              ? `${((currentSlide + 1) / heroSlides.length) * 100}%`
              : "0%",
          }}
        />
      </div>
    </div>
  );
}
