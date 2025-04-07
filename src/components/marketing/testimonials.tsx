"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    content: "The AI-powered image enhancement is incredible. It's saved me countless hours of manual editing.",
    author: {
      name: "Sarah Chen",
      role: "Professional Photographer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "SC"
    }
  },
  {
    content: "The background removal tool is a game-changer for my e-commerce business. It's fast and accurate.",
    author: {
      name: "Michael Rodriguez",
      role: "E-commerce Store Owner",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "MR"
    }
  },
  {
    content: "I've tried many image processing tools, but this one stands out for its ease of use and quality results.",
    author: {
      name: "Emily Thompson",
      role: "Digital Content Creator",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "ET"
    }
  }
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Testimonials</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Loved by Professionals Worldwide
          </p>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
            See what our users have to say about their experience with our AI-powered image processing tools.
          </p>
        </div>
        <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 text-sm leading-6 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-x-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={testimonial.author.image} alt={testimonial.author.name} />
                      <AvatarFallback className="text-sm sm:text-base">{testimonial.author.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.author.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {testimonial.author.role}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 