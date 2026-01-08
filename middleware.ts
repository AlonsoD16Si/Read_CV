/**
 * Next.js middleware
 * Handles authentication and user state routing
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to dashboard routes for authenticated users
    // Specific route protection is handled in page components
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        // Allow public routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/u/:path*", // Profile pages (for future custom domain handling)
  ],
};

