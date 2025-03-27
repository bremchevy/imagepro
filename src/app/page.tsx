import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Testimonials } from "@/components/marketing/testimonials";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <Testimonials />
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h2 className="text-center text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:leading-[1.1]">
            Powerful Image Editing Tools
          </h2>
          <p className="max-w-[750px] text-center text-lg text-foreground/80 sm:text-xl">
            Everything you need to create professional-quality images
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:gap-8">
          <div className="card animate-fade-in">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold text-foreground">Background Removal</h3>
                <p className="text-sm text-foreground/80">
                  Remove backgrounds from images instantly with AI
                </p>
              </div>
            </div>
          </div>
          <div className="card animate-fade-in [animation-delay:200ms]">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold text-foreground">Image Upscaling</h3>
                <p className="text-sm text-foreground/80">
                  Enhance image quality and resolution
                </p>
              </div>
            </div>
          </div>
          <div className="card animate-fade-in [animation-delay:400ms]">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold text-foreground">Object Removal</h3>
                <p className="text-sm text-foreground/80">
                  Remove unwanted objects from images
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h2 className="text-center text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:leading-[1.1]">
            Ready to Transform Your Images?
          </h2>
          <p className="max-w-[750px] text-center text-lg text-foreground/80 sm:text-xl">
            Join thousands of professionals who trust Imagepro for their image editing needs
          </p>
          <div className="flex w-full items-center justify-center space-x-4 py-4 md:py-10">
            <Link href="/register">
              <Button size="lg" className="btn-primary">Start Free Trial</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="btn-secondary">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
                Imagepro
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
