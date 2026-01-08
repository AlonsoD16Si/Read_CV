/**
 * Sign out button component (client-side)
 */

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/" 
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect even if signOut fails
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}

