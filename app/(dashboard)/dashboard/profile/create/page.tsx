/**
 * Create profile page - Onboarding flow
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function CreateProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (user?.profile) {
    redirect("/dashboard/profile/edit");
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Welcome to Nexary</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Let's create your professional identity in just a few steps
        </p>
      </div>
      <OnboardingWizard userId={session.user.id} />
    </div>
  );
}

