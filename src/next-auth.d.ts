import "next-auth";
import "next-auth/jwt"; // <-- Import JWT type

// User session on the client
declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

// The token object on the server
declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
  }
}
