import "next-auth";
import "next-auth/jwt";

// İzinlerin yapısını tanımla
interface AdminPermissions {
  canManageAdmins?: boolean;
  canManageBlog?: boolean;
  canManageLinks?: boolean;
  canManageNeeds?: boolean;
  canManageTimeline?: boolean;
  canManageSettings?: boolean;
  canManageProjects?: boolean;
}

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      isAdmin?: boolean;
      permissions?: AdminPermissions;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
    permissions?: AdminPermissions;
    username?: string;
  }
}
