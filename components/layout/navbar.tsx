/**
 * Navigation bar component
 */

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { siteConfig } from "@/config/site";

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-semibold">
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              {session.user.username ? (
                <Link href={`/u/${session.user.username}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    @{session.user.username}
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard/profile/create">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    Set username
                  </Button>
                </Link>
              )}
              <div className="hidden flex-col items-end leading-tight md:flex">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {session.user.name || session.user.email}
                </span>
                {session.user.name && session.user.email && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {session.user.email}
                  </span>
                )}
              </div>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
