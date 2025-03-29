"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    content: "The AI-powered image enhancement is incredible. It's saved me countless hours of manual editing.",
    author: {
      name: "Sarah Chen",
      role: "Professional Photographer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    content: "The background removal tool is a game-changer for my e-commerce business. It's fast and accurate.",
    author: {
      name: "Michael Rodriguez",
      role: "E-commerce Store Owner",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    content: "I've tried many image processing tools, but this one stands out for its ease of use and quality results.",
    author: {
      name: "Emily Thompson",
      role: "Digital Content Creator",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export function Testimonials() {
  return (
    <section className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h2 className="text-center text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:leading-[1.1]">
          Loved by Professionals Worldwide
        </h2>
        <p className="max-w-[750px] text-center text-lg text-foreground/80 sm:text-xl">
          See what our users have to say about their experience with our AI-powered image processing tools.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:gap-8">
        <div className="card animate-fade-in">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <p className="text-sm text-foreground/80">
                "The AI-powered image enhancement is incredible. It's saved me countless hours of manual editing."
              </p>
              <div className="flex items-center space-x-2">
                <div className="font-semibold text-foreground">Sarah Chen</div>
                <div className="text-sm text-foreground/60">Professional Photographer</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card animate-fade-in [animation-delay:200ms]">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <p className="text-sm text-foreground/80">
                "The background removal tool is a game-changer for my e-commerce business. It's fast and accurate."
              </p>
              <div className="flex items-center space-x-2">
                <div className="font-semibold text-foreground">Michael Rodriguez</div>
                <div className="text-sm text-foreground/60">E-commerce Store Owner</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card animate-fade-in [animation-delay:400ms]">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <p className="text-sm text-foreground/80">
                "I've tried many image processing tools, but this one stands out for its ease of use and quality results."
              </p>
              <div className="flex items-center space-x-2">
                <div className="font-semibold text-foreground">Emily Thompson</div>
                <div className="text-sm text-foreground/60">Digital Content Creator</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 