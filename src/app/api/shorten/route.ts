import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Validate the URL
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Geçersiz URL formatı." },
        { status: 400 }
      );
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.LINK_SHORTENER_SHEET_ID;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !sheetId) {
      throw new Error("API için gerekli ortam değişkenleri eksik.");
    }

    // Generate a short, unique slug
    const slug = nanoid(7); // e.g., "abC1_dE"

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[slug, url]], // Save slug and the original URL
      },
    });

    // Construct the short URL to return to the client
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${request.headers.get("host")}`;
    const shortUrl = `https://pehli1team.com/s/${slug}`;

    return NextResponse.json({ success: true, shortUrl });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
