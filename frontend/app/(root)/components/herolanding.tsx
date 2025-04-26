"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const slides = [
  { image: "/header.png" },
  { image: "/header1.png" },
  { image: "/header2.png"},
];

export default function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section className="w-full relative">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="w-full">
              <Image 
                src={slide.image} 
                alt={`Slide ${index + 1}`} 
                width={1920} 
                height={700} 
                className="w-full h-auto object-cover" 
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 lg:left-12 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="absolute right-4 lg:right-12 top-1/2 transform -translate-y-1/2" />
      </Carousel>
    </section>
  );
}