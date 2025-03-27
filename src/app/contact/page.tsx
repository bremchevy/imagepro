import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock, MessageSquare, Globe, Shield, Users } from "lucide-react";

const contactInfo = [
  {
    name: "Email",
    description: "support@imagero.com",
    icon: Mail,
    details: "We typically respond within 24 hours",
  },
  {
    name: "Office",
    description: "123 Tech Street, San Francisco, CA 94105",
    icon: MapPin,
    details: "Visit us Monday to Friday, 9am - 5pm PST",
  },
  {
    name: "Phone",
    description: "+1 (555) 123-4567",
    icon: Phone,
    details: "Available Monday to Friday, 9am - 5pm PST",
  },
  {
    name: "Live Chat",
    description: "Available 24/7",
    icon: MessageSquare,
    details: "Get instant support from our team",
  },
];

const faqs = [
  {
    question: "What are your business hours?",
    answer: "Our support team is available Monday through Friday, 9am to 5pm PST. For urgent issues, you can reach us through our 24/7 live chat service.",
  },
  {
    question: "How long does it take to get a response?",
    answer: "We typically respond to all inquiries within 24 hours. For urgent matters, please use our live chat service for immediate assistance.",
  },
  {
    question: "Do you offer enterprise support?",
    answer: "Yes, we provide dedicated enterprise support with guaranteed response times and dedicated account managers. Contact our sales team for more information.",
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/10">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>
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
                    htmlFor="subject"
                    className="block text-sm font-semibold leading-6 text-foreground"
                  >
                    Subject
                  </label>
                  <div className="mt-2.5">
                    <select
                      name="subject"
                      id="subject"
                      className="input w-full"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="enterprise">Enterprise Sales</option>
                      <option value="other">Other</option>
                    </select>
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
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                <div key={item.name} className="relative pl-9">
                  <dt className="inline font-semibold text-foreground">
                    <div className="absolute left-1 top-1 h-5 w-5 text-primary">
                        <Icon className="h-5 w-5" />
                    </div>
                    {item.name}
                  </dt>
                    <dd className="inline">{item.description}</dd>
                    <dd className="mt-2 text-sm text-foreground/60">{item.details}</dd>
                </div>
                );
              })}
            </dl>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
                Find answers to common questions about our support services.
            </p>
          </div>
            <dl className="mt-16 space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg bg-card p-6 shadow-sm">
                  <dt className="text-lg font-semibold leading-7 text-foreground">
                    {faq.question}
              </dt>
                  <dd className="mt-4 text-base leading-7 text-foreground/80">
                    {faq.answer}
              </dd>
            </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Support Features Section */}
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Support Features
              </h2>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                We provide comprehensive support to ensure you get the most out of our platform.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col gap-y-4 rounded-lg bg-card p-6 shadow-sm">
                <Globe className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-semibold leading-7 text-foreground">
                  24/7 Availability
                </h3>
                <p className="text-base leading-7 text-foreground/80">
                  Our support team is available around the clock to help you with any questions or issues.
                </p>
              </div>
              <div className="flex flex-col gap-y-4 rounded-lg bg-card p-6 shadow-sm">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-semibold leading-7 text-foreground">
                  Secure Communication
                </h3>
                <p className="text-base leading-7 text-foreground/80">
                  All communications are encrypted and secure to protect your privacy and data.
                </p>
              </div>
              <div className="flex flex-col gap-y-4 rounded-lg bg-card p-6 shadow-sm">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-semibold leading-7 text-foreground">
                  Expert Support Team
                </h3>
                <p className="text-base leading-7 text-foreground/80">
                  Our team of experts is trained to handle any technical or business-related inquiries.
                </p>
              </div>
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