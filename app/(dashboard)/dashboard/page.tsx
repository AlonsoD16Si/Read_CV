/**
 * Dashboard page - Central hub for profile management
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlanById } from "@/config/plans";
import { determineUserState } from "@/lib/user-states";
import { siteConfig } from "@/config/site";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      profile: {
        include: {
          sections: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  const plan = getPlanById((user?.planId as any) || "free");
  const userState = determineUserState(
    session,
    user?.profile?.userId,
    user?.planId as any,
    user?.profile?.published
  );

  // Get analytics summary (if Pro)
  let analyticsSummary = null;
  if (user?.profile && plan.id === "pro") {
    const analytics = await prisma.analytics.findMany({
      where: { profileId: user.profile.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    
    const views = analytics.filter(a => a.eventType === "view").length;
    const clicks = analytics.filter(a => a.eventType === "click").length;
    const recentViews = analytics
      .filter(a => a.eventType === "view")
      .slice(0, 7)
      .length;

    analyticsSummary = {
      totalViews: views,
      totalClicks: clicks,
      recentViews,
    };
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your professional identity on Nexary
        </p>
      </div>

      {/* Onboarding prompt for users without profile */}
      {!user?.profile && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle>Welcome to Nexary!</CardTitle>
            <CardDescription>
              Create your professional identity in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/profile/create">
              <Button size="lg">Get Started</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              {user?.profile
                ? "Manage your professional identity"
                : "Create your professional identity"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.profile ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Profile URL
                  </p>
                  <p className="font-medium">
                    {siteConfig.profileUrl.free(user.profile.username)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <p className="font-medium">
                    {user.profile.published ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ Published
                      </span>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">
                        Draft
                      </span>
                    )}
                  </p>
                </div>
                {user.profile.sections && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sections
                    </p>
                    <p className="font-medium">
                      {user.profile.sections.length} section{user.profile.sections.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard/profile/edit">
                    <Button className="w-full">Edit Profile</Button>
                  </Link>
                  {user.profile.username && (
                    <Link
                      href={`/u/${user.profile.username}${
                        user.profile.published ? "" : "?preview=1"
                      }`}
                      target="_blank"
                    >
                      <Button variant="outline" className="w-full">
                        {user.profile.published
                          ? "View Public Profile"
                          : "Preview Profile"}
                      </Button>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <Link href="/dashboard/profile/create">
                <Button className="w-full">Create Profile</Button>
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
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            )}
            {plan.id === "pro" && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Thank you for being a Pro member!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Analytics Card (Pro only) */}
        {plan.id === "pro" && user?.profile && analyticsSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Profile performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Views
                </p>
                <p className="text-2xl font-bold">{analyticsSummary.totalViews}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Clicks
                </p>
                <p className="text-2xl font-bold">{analyticsSummary.totalClicks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Views (Last 7 days)
                </p>
                <p className="text-2xl font-bold">{analyticsSummary.recentViews}</p>
              </div>
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full">
                  View Full Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

