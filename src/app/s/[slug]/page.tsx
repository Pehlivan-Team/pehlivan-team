import { google } from "googleapis";
import { redirect, notFound } from "next/navigation";

async function getUrlFromSlug(slug: string): Promise<string | null> {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.LINK_SHORTENER_SHEET_ID;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !sheetId) {
      throw new Error("API için gerekli ortam değişkenleri eksik.");
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      // FIX: Changed "Sheet1!A:B" to just "A:B" to use the first available sheet
      range: "A:B", 
    });

    const rows = response.data.values;
    if (rows) {
      const row = rows.find(r => r[0] === slug);
      if (row && row[1]) {
        return row[1];
      }
    }
    return null;

  } catch (error) {
    console.error("Redirect Error:", error);
    return null;
  }
}

export default async function ShortLinkRedirectPage({ params }: { params: { slug: string } }) {
  const longUrl = await getUrlFromSlug(params.slug);

  if (!longUrl) {
    return notFound();
  }

  redirect(longUrl);
}