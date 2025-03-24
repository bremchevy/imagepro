import { MarketingNav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tools = [
  {
    name: "Background Removal",
    description: "Remove backgrounds from images instantly with AI-powered precision",
    features: [
      "One-click background removal",
      "Fine-tune edges",
      "Multiple background options",
      "Batch processing",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: "Image Upscaling",
    description: "Enhance image quality and resolution with advanced AI algorithms",
    features: [
      "4x upscaling",
      "No quality loss",
      "Multiple AI models",
      "Custom presets",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
  },
  {
    name: "Object Removal",
    description: "Remove unwanted objects from images while preserving the background",
    features: [
      "Smart object detection",
      "Content-aware fill",
      "Multiple object selection",
      "Undo/redo support",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
  },
  {
    name: "Color Correction",
    description: "Adjust colors and tones to achieve the perfect look",
    features: [
      "Auto color correction",
      "Advanced color grading",
      "Preset filters",
      "Batch processing",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Powerful Image Editing Tools
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Our suite of AI-powered tools helps you create professional-quality images in minutes.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-2">
            {tools.map((tool) => (
              <div key={tool.name} className="card group relative">
                <div className="flex items-center gap-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
                    {tool.icon}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{tool.name}</h2>
                </div>
                <p className="mt-4 text-foreground/80">{tool.description}</p>
                <ul role="list" className="mt-6 space-y-3">
                  {tool.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3 text-sm text-foreground/80">
                      <svg
                        className="h-6 w-5 flex-none text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/register">
                    <Button className="btn-primary">Try {tool.name}</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg leading-8 text-foreground/80">
              Sign up for a free account and start editing your images today.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button className="btn-primary">Create Free Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-foreground/80 md:text-left">
              Built by{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Image?ro
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 