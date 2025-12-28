/**
 * Pricing page
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { plans, getPlanById } from "@/config/plans";
import { generateSiteMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSiteMetadata(
  "Pricing",
  "Choose the plan that's right for you. Free forever or upgrade to Pro for advanced features."
);

export default function PricingPage() {
  const freePlan = getPlanById("free");
  const proPlan = getPlanById("pro");

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          Choose the plan that's right for you. Free forever or upgrade to Pro
          for advanced features.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>{freePlan.name}</CardTitle>
            <CardDescription>{freePlan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">Free</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {freePlan.features.map((feature) => (
                <li key={feature.id} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                    ✓
                  </span>
                  <div>
                    <div className="font-medium">{feature.name}</div>
                    {feature.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-black dark:border-white">
          <CardHeader>
            <CardTitle>{proPlan.name}</CardTitle>
            <CardDescription>{proPlan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">
                ${proPlan.price?.monthly}
              </span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {proPlan.features.map((feature) => (
                <li key={feature.id} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                    ✓
                  </span>
                  <div>
                    <div className="font-medium">{feature.name}</div>
                    {feature.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/register" className="w-full">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

