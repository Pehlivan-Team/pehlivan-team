import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { firestoreAdmin } from './firebase-admin';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // This callback runs when a JSON Web Token is created (i.e., on sign in).
        async jwt({ token }) {
            if (token.email) {
                try {
                    const adminDoc = await firestoreAdmin.collection('admins').doc(token.email).get();
                    // If user is in the admins collection, add isAdmin: true to the token.
                    token.isAdmin = adminDoc.exists && adminDoc.data()?.isAdmin === true;
                } catch (error) {
                    console.error("JWT callback Firestore error:", error);
                    token.isAdmin = false;
                }
            }
            return token;
        },
        // This callback runs when a session is checked on the client.
        async session({ session, token }) {
            // Pass the isAdmin flag from the token to the client-side session object.
            if (session.user) {
                session.user.isAdmin = token.isAdmin as boolean;
            }
            return session;
        },
    },
};