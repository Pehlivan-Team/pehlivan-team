import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createShortLink } from "@/lib/shortener"; // <-- Import the new function

export async function POST(request: NextRequest) {
  try {
    const { part_name, quantity, price, link, team } = await request.json();

    if (!part_name || !quantity || !price || !link || !team) {
      return NextResponse.json(
        { success: false, error: "Tüm zorunlu alanlar doldurulmalıdır." },
        { status: 400 }
      );
    }

    // --- NEW: Shorten the link first ---
    const shortUrl = await createShortLink(link, request.headers);

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    // This is the ID for the needs list spreadsheet
    const spreadsheetId = "1fpEpikCHVi58YZBGL6_7zoRxdbjMuDutDvHk5BDhFHE";

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error("Google API için gerekli ortam değişkenleri eksik.");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Append the new item with the SHORT URL to the correct sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: team, // Uses the team name as the sheet name (e.g., "Mekanik")
      valueInputOption: "USER_ENTERED",
      requestBody: {
        // We no longer need to generate a separate UUID here
        values: [[part_name, quantity, shortUrl,  price ]],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ürün başarıyla eklendi.",
    });
  } catch (error) {
    console.error("API Error in /api/liste/ekle:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
