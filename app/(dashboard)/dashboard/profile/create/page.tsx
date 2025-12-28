/**
 * Create profile page
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileCreator } from "@/components/profile/profile-creator";

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
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Create Your Profile</h1>
        <ProfileCreator userId={session.user.id} />
      </div>
    </div>
  );
}

