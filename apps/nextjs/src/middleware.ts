import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
	debug: false,
	ignoredRoutes: ["/refer-a-friend", "/api/email/send"],
	publicRoutes: [
		"/login",
		"/signup",
		"/test",
		"/reset-password",
		"/api/uploadthing(.*)",
		"/api/clerk/webhook",
		"/api/typeform/webhook",
		"/api/fillout/webhook",
		"/api/trpc/auth(.*)",
		"/_axiom/web-vitals"
	],
	afterAuth(auth, req, evt) {
		// MANUAL check for this endpoint to ensure that it bypasses any redirects handled by the below cases
		if (req.url.includes("/api/uploadthing?slug=")) {
			return NextResponse.next();
		}
		// handle users who aren't authenticated navigating to a protected route
		if (!auth.userId && !auth.isPublicRoute) {
			const signInUrl = new URL("/login", req.url);
			return redirectToSignIn({ returnBackUrl: req.url });
		}
		// handle users who aren't authenticated navigating to a public route
		if (!auth.userId && auth.isPublicRoute) {
			return NextResponse.next();
		}
		// handle users who are authenticated navigating to a public route
		if (auth.userId && auth.isPublicRoute) {
			const authUrl = new URL("/", req.url);
			return NextResponse.redirect(authUrl.href);
		}
		/*// If the user is logged in and trying to access a protected route, allow them to access route
        if (auth.userId && !auth.isPublicRoute) {
            return NextResponse.next()
        }
        // Allow users visiting public routes to access them
        return NextResponse.next();*/
	}
});

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
		"/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)"
	]
};
