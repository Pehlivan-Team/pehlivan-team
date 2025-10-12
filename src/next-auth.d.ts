import "next-auth";
import "next-auth/jwt";

// İzinlerin yapısını tanımla
interface AdminPermissions {
  canManageAdmins?: boolean;
  canManageBlog?: boolean;
  canManageLinks?: boolean;
  canManageNeeds?: boolean;
  canManageTimeline?: boolean;
  canManageSettings?: boolean; // Yeni izin türü
  [key: string]: boolean | undefined; // Gelecekte eklenebilecek diğer izinler için esneklik
}

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean;
      permissions?: AdminPermissions; // Session'a permissions ekle
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
    permissions?: AdminPermissions; // Token'a permissions ekle
  }
}
