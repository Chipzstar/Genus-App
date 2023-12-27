import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddleware, redirectToSignIn,  } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/login",
    "/signup",
    "/forgot-password",
    "/api",
    "/api/trpc/auth(.*)"
  ],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated navigating to a protected route
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/login", req.url);
      return redirectToSignIn({returnBackUrl: req.url});
    }
    // handle users who are authenticated navigating to a public route
    if (auth.userId && auth.isPublicRoute) {
      const authUrl = new URL("/", req.url);
      return NextResponse.redirect(authUrl.href);
    }
    // redirect to the default group page
    if (req.nextUrl.pathname === '/groups') {
      return NextResponse.redirect(new URL("/groups/pre-spring-week-chat", req.url));
    }
  }
})

// Stop Middleware running on static files
export const config = {
  matcher: [
    /*
     * Match request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     *
     * This includes images, and requests from TRPC.
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
  ],
};
