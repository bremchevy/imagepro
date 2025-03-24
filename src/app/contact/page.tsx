import { MarketingNav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const contactInfo = [
  {
    name: "Email",
    description: "support@imagero.com",
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
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: "Office",
    description: "123 Tech Street, San Francisco, CA 94105",
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
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    name: "Phone",
    description: "+1 (555) 123-4567",
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
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/10">
          <div className="container py-24 sm:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Contact Us
              </h1>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Send us a message
              </h2>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            <form className="mx-auto mt-16 max-w-xl sm:mt-20">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold leading-6 text-foreground"
                  >
                    First name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="input w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold leading-6 text-foreground"
                  >
                    Last name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="input w-full"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-foreground"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      className="input w-full"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold leading-6 text-foreground"
                  >
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      className="input w-full"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="btn-primary w-full">
                    Send message
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Get in touch
              </h2>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                We're here to help. Reach out to us through any of these channels.
              </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
              {contactInfo.map((item) => (
                <div key={item.name} className="relative pl-9">
                  <dt className="inline font-semibold text-foreground">
                    <div className="absolute left-1 top-1 h-5 w-5 text-primary">
                      {item.icon}
                    </div>
                    {item.name}
                  </dt>
                  <dd className="inline text-foreground/80">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Can't find what you're looking for? Check out our FAQ section.
            </p>
          </div>
          <dl className="mx-auto mt-16 max-w-2xl space-y-8 text-base leading-7 sm:mt-20">
            <div className="relative pl-9">
              <dt className="inline font-semibold text-foreground">
                <svg
                  className="absolute left-1 top-1 h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.2 10.77a.75.75 0 01.02-1.06L10 6.832l4.78 2.878a.75.75 0 11-.04 1.06l-5.25 3.25a.75.75 0 01-.78 0l-5.25-3.25a.75.75 0 01-.04-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
                What payment methods do you accept?
              </dt>
              <dd className="inline text-foreground/80">
                We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
              </dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-foreground">
                <svg
                  className="absolute left-1 top-1 h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.2 10.77a.75.75 0 01.02-1.06L10 6.832l4.78 2.878a.75.75 0 11-.04 1.06l-5.25 3.25a.75.75 0 01-.78 0l-5.25-3.25a.75.75 0 01-.04-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
                How do I get started?
              </dt>
              <dd className="inline text-foreground/80">
                Simply sign up for a free account, and you can start using our tools immediately. No credit card required.
              </dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-foreground">
                <svg
                  className="absolute left-1 top-1 h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.2 10.77a.75.75 0 01.02-1.06L10 6.832l4.78 2.878a.75.75 0 11-.04 1.06l-5.25 3.25a.75.75 0 01-.78 0l-5.25-3.25a.75.75 0 01-.04-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
                What kind of support do you offer?
              </dt>
              <dd className="inline text-foreground/80">
                We offer email support for all users, priority support for Pro users, and dedicated support for Enterprise customers.
              </dd>
            </div>
          </dl>
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