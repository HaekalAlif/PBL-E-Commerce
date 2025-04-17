"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const slides = [
  { image: "/header.png" },
  { image: "/header1.png" },
  { image: "/header2.png"},
];

export default function Hero() {
  return (
    <section className="w-full relative">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="w-full">
              <Image src={slide.image} alt={`Slide ${index + 1}`} width={1920} height={700} className="w-full h-auto object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-12 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="absolute right-12 top-1/2 transform -translate-y-1/2" />
      </Carousel>
    </section>
  );
}