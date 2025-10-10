import admin from "firebase-admin";

// If the app is already initialized, return the existing app.
if (admin.apps.length) {
  // Do nothing, already initialized
} else {
  // If not initialized, try to initialize.
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    };

    // Check if the required environment variables are present
    if (
      !serviceAccount.projectId ||
      !serviceAccount.clientEmail ||
      !serviceAccount.privateKey
    ) {
      throw new Error(
        "Firebase service account environment variables are not set or are incorrect."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    // This will now cause a crash with a clear error message if initialization fails,
    // which is better than failing silently.
    throw new Error(`Firebase Admin Initialization Error: ${error.message}`);
  }
}

// Export the initialized firestore instance
export const firestoreAdmin = admin.firestore();
