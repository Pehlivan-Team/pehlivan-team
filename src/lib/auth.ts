import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { firestoreAdmin } from "./firebase-admin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Bu fonksiyon, kullanıcı giriş yaptığında bir kez çalışır.
    async jwt({ token, user }) {
      // İlk giriş anında (user nesnesi sadece bu anda mevcuttur)
      if (user && user.email) {
        try {
          const adminDoc = await firestoreAdmin
            .collection("admins")
            .doc(user.email)
            .get();
          if (adminDoc.exists && adminDoc.data()?.isAdmin === true) {
            token.isAdmin = true;
            token.permissions = adminDoc.data()?.permissions || {"none": true};
          } else {
            token.isAdmin = false;
            token.permissions = {};
          }
        } catch (error) {
          console.error("JWT callback Firestore error:", error);
          token.isAdmin = false;
          token.permissions = {};
        }
      }
      return token;
    },

    // Bu fonksiyon, useSession() gibi istemci tarafı fonksiyonları her çalıştığında çağrılır.
    // Token'daki (sunucudaki) verileri, istemci tarafına gönderilecek olan session nesnesine aktarır.
    async session({ session, token }) {
      if (session.user) {
        // Token'daki isAdmin ve permissions bilgilerini session'a aktar.
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
};
