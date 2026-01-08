/**
 * Edit profile page
 */

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileEditor } from "@/components/profile/profile-editor";

export default async function EditProfilePage() {
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
          experiences: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!user?.profile) {
    redirect("/dashboard/profile/create");
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Edit Your Profile</h1>
        <ProfileEditor profile={user.profile} />
      </div>
    </div>
  );
}
