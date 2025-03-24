import { MarketingNav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { name: "Active Users", value: "10K+" },
  { name: "Images Processed", value: "1M+" },
  { name: "Customer Satisfaction", value: "98%" },
  { name: "Countries", value: "50+" },
];

const team = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Jane Smith",
    role: "Head of AI",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Mike Johnson",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/10">
          <div className="container py-24 sm:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                About Image?ro
              </h1>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                We're on a mission to democratize professional image editing by making powerful AI tools accessible to everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-foreground/80">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Story Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg prose-primary mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Story</h2>
              <p className="text-foreground/80">
                Founded in 2023, Image?ro emerged from a simple observation: professional image editing tools were either too complex or too expensive for most people. We set out to change that by leveraging cutting-edge AI technology to create intuitive, powerful tools that anyone can use.
              </p>
              <p className="text-foreground/80">
                Today, we're proud to serve thousands of users worldwide, from individual creators to large enterprises. Our commitment to innovation and user experience continues to drive us forward.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Meet Our Team
              </h2>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                The passionate people behind Image?ro
              </p>
            </div>
            <ul
              role="list"
              className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              {team.map((person) => (
                <li key={person.name} className="group relative">
                  <div className="aspect-[3/2] overflow-hidden rounded-lg">
                    <img
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={person.image}
                      alt={person.name}
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-8 text-foreground">
                    {person.name}
                  </h3>
                  <p className="text-base leading-7 text-foreground/80">{person.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Join Our Journey
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Be part of the future of image editing
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button className="btn-primary">Get Started</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="btn-secondary">
                  Contact Us
                </Button>
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