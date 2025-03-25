import { MarketingNav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with basic image editing",
    features: [
      "5 images per month",
      "Basic background removal",
      "Standard resolution",
      "Community support",
    ],
    cta: "Get Started",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals who need more power and features",
    features: [
      "Unlimited images",
      "Advanced background removal",
      "High resolution output",
      "Priority support",
      "Batch processing",
      "API access",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations with custom needs",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Custom training",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Choose the perfect plan for your needs. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="isolate mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`card relative flex flex-col justify-between ${
                  tier.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                    Most popular
                  </div>
                )}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-foreground">{tier.name}</h2>
                  <p className="mt-4 text-sm text-foreground/80">{tier.description}</p>
                  <p className="mt-6">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-foreground/80">
                      /month
                    </span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-foreground/80">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
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
                </div>
                <div className="p-8">
                  <Link href={tier.href}>
                    <Button
                      className={`w-full ${
                        tier.popular ? "btn-primary" : "btn-secondary"
                      }`}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Need a custom plan?
            </h2>
            <p className="mt-4 text-lg leading-8 text-foreground/80">
              Contact our sales team for a custom quote tailored to your needs.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button className="btn-primary">Contact Sales</Button>
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