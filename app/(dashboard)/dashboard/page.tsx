/**
 * Dashboard page
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlanById } from "@/config/plans";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  const plan = getPlanById((user?.planId as any) || "free");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your profile and subscription
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              {user?.profile
                ? "Manage your public profile"
                : "Create your public profile"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.profile ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Username
                  </p>
                  <p className="font-medium">{user.profile.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <p className="font-medium">
                    {user.profile.published ? (
                      <span className="text-green-600">Published</span>
                    ) : (
                      <span className="text-gray-600">Draft</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard/profile/edit">
                    <Button>Edit Profile</Button>
                  </Link>
                  {user.profile.published && user.profile.username && (
                    <Link href={`/u/${user.profile.username}`} target="_blank">
                      <Button variant="outline">View Profile</Button>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <Link href="/dashboard/profile/create">
                <Button>Create Profile</Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
              <p className="text-2xl font-bold">{plan.name}</p>
            </div>
            {plan.price ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Price
                </p>
                <p className="font-medium">
                  ${plan.price.monthly}/{plan.price.currency === "USD" ? "mo" : plan.price.currency}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">Free forever</p>
            )}
            {plan.id === "free" && (
              <Link href="/pricing">
                <Button>Upgrade to Pro</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

