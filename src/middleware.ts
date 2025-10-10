import { withAuth } from "next-auth/middleware";

export default withAuth(
  // The middleware function is not needed, the callbacks handle everything.
  {
    callbacks: {
      authorized: ({ token }) => {
        // The middleware now only needs to check for the isAdmin flag on the token.
        // It will allow access if a token exists AND token.isAdmin is true.
        return !!token && token.isAdmin === true;
      },
    },
  }
);

export const config = {
  // This middleware still protects all routes starting with /admin.
  matcher: ["/admin/:path*"],
};