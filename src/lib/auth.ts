import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { firestoreAdmin } from "./firebase-admin"; //
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // session: { strategy: "jwt" } // Zaten varsayılan, ama belirtmek iyidir
  providers: [
    // 1. Google (Mevcut)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 2. YENİ: GitHub
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // 3. YENİ: LinkedIn
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),

    // 4. YENİ: Credentials (E-posta/Şifre)
    CredentialsProvider({
      name: "E-posta ve Şifre",
      credentials: {
        email: {
          label: "E-posta",
          type: "email",
          placeholder: "test@test.com",
        },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("E-posta ve şifre zorunludur.");
        }

        const userRef = firestoreAdmin
          .collection("users")
          .doc(credentials.email);
        const userDoc = await userRef.get();

        // 1. Kullanıcı Firestore'da var mı?
        if (!userDoc.exists) {
          throw new Error("Bu e-posta ile kayıtlı kullanıcı bulunamadı.");
        }

        const userData = userDoc.data();

        // 2. Kullanıcının şifresi var mı? (OAuth ile kaydolmamış olmalı)
        if (!userData?.hashedPassword) {
          throw new Error(
            "Bu hesap şifre ile değil, sosyal medya ile oluşturulmuş. Lütfen o yöntemle giriş yapın."
          );
        }

        // 3. Şifre doğru mu?
        const isValid = await bcrypt.compare(
          credentials.password,
          userData.hashedPassword
        );

        if (!isValid) {
          throw new Error("Geçersiz şifre.");
        }

        // Başarılı giriş: user nesnesini döndür
        // DİKKAT: Şifreyi asla geri döndürmeyin!
        return {
          id: userDoc.id,
          email: userData.email,
          name: userData.name,
          image: userData.profilePictureUrl || userData.image,
          isAdmin: false, // isAdmin bilgisi 'jwt' callback'inde eklenecek
          permissions: {}, // permissions 'jwt' callback'inde eklenecek
          username: userData.username, // username 'jwt' callback'inde eklenecek
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  //Tokenin sosyal.pehli1team.com'da da çalışması için gerekli ancak düzgün çalıştıramadım.
  /* cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.COOKIE_DOMAIN || ".pehli1team.com",
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.csrf-token" 
          : "next-auth.csrf-token",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.COOKIE_DOMAIN || ".pehli1team.com",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.COOKIE_DOMAIN || ".pehli1team.com",
      },
    },
  }, */
  callbacks: {
    // Bu callback, TÜM giriş türlerinden (OAuth veya Credentials) sonra çalışır.
    async jwt({ token, user }) {
      // 'user' objesi sadece ilk girişte mevcuttur.
      if (user && user.email) {
        const userEmail = user.email;

        // 1. Admin yetkilerini kontrol et (Mevcut Kodunuz)
        try {
          const adminDoc = await firestoreAdmin
            .collection("admins")
            .doc(userEmail)
            .get();
          if (adminDoc.exists && adminDoc.data()?.isAdmin === true) {
            token.isAdmin = true;
            token.permissions = adminDoc.data()?.permissions || { none: true };
          } else {
            token.isAdmin = false;
            token.permissions = {};
          }
        } catch (error) {
          console.error("JWT admin check error:", error);
          token.isAdmin = false;
          token.permissions = {};
        }

        // 2. Kullanıcı profilini (ve kullanıcı adını) al veya oluştur
        // Bu mantık hem OAuth (Google, GitHub, LinkedIn) hem de Credentials için çalışır.
        try {
          const userRef = firestoreAdmin.collection("users").doc(userEmail);
          const userDoc = await userRef.get();
          const defaultUsername = userEmail.split("@")[0];

          if (!userDoc.exists) {
            // YENİ OAuth kullanıcısı için profil oluştur
            // (Credentials kullanıcısı 'register' API'si ile zaten oluşturulmuş olmalı)
            const defaultProfile = {
              email: userEmail,
              name: user.name || "Kullanıcı",
              image: user.image || "", // Google/GitHub/LinkedIn'den gelen resim
              username: defaultUsername,
              bio: "",
              team: "",
              profilePictureUrl: user.image || "",
              socialLinks: {},
              // hashedPassword: null, // OAuth ile giriş yaptığı için şifresi yok
            };
            await userRef.set(defaultProfile);
            token.username = defaultUsername;
            token.profilePictureUrl = defaultProfile.profilePictureUrl || "";
          } else {
            // Mevcut kullanıcı (OAuth veya Credentials)
            token.username = userDoc.data()?.username || defaultUsername;
            token.profilePictureUrl = userDoc.data()?.profilePictureUrl || user.image || "";
          }
        } catch (error) {
          console.error("JWT user profile error:", error);
          token.username = userEmail.split("@")[0];
          token.profilePictureUrl = "";
        }
      }
      return token;
    },

    // Bu kodda değişiklik yok, 'username'i session'a aktarıyor
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.permissions = token.permissions;
        session.user.username = token.username as string;
        // Prefer profilePictureUrl stored in token (from users collection), fallback to existing image
        (session.user as any).profilePictureUrl = token.profilePictureUrl as string;
        // Also set the canonical `session.user.image` so existing UI that reads `image` shows the stored picture
        session.user.image = (token.profilePictureUrl as string) || session.user.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
