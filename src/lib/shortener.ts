import { google } from "googleapis";
import { nanoid } from "nanoid";

export async function createShortLink(
  longUrl: string,
  requestHeaders: Headers
): Promise<string> {
  try {
    // Validate the URL format
    new URL(longUrl);
  } catch (error) {
    throw new Error("Geçersiz URL formatı.");
  }

  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.LINK_SHORTENER_SHEET_ID;

  if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !sheetId) {
    throw new Error("Link kısaltıcı için gerekli ortam değişkenleri eksik.");
  }

  const slug = nanoid(7);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Save the new slug and long URL to the link shortener sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A1", // Append to the first sheet
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[slug, longUrl]],
    },
  });

  // Construct the full short URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || `https://${requestHeaders.get("host")}`;
  return `${baseUrl}/s/${slug}`;
}
