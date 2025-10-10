import { nanoid } from "nanoid";
import { firestoreAdmin } from "@/lib/firebase-admin"; // <-- Use the ADMIN SDK
import admin from 'firebase-admin'; // Import the main admin object for the timestamp

export async function createShortLink(longUrl: string, requestHeaders: Headers): Promise<string> {
  try {
    new URL(longUrl);
  } catch (error) {
    throw new Error("Geçersiz URL formatı.");
  }

  const slug = nanoid(7);

  try {
    // Use the Admin SDK syntax to access the 'links' collection
    const linksCollectionRef = firestoreAdmin.collection("links");

    // Add a new document using the Admin SDK's 'add' method
    await linksCollectionRef.add({
      slug: slug,
      longUrl: longUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use the Admin SDK's timestamp
    });

    // Construct the full short URL and return it
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://pehli1team.com`;
    return `${baseUrl}/s/${slug}`;

  } catch (error) {
    console.error("Firestore (Admin) write error:", error);
    throw new Error("Kısa link oluşturulurken bir veritabanı hatası oluştu.");
  }
}