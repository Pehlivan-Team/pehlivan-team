import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, student_number, department, team } = await request.json();

    if (!name || !student_number || !team || !department) {
      return NextResponse.json({ success: false, error: "ERR_MISSING_FIELDS" }, { status: 400 });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.SIGN_SHEET_ID) {
      throw new Error("Missing Google API credentials in environment variables.");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SIGN_SHEET_ID,
      range: "A1", // Appending to the first available row
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, student_number, phone || "BOŞ", email || "BOŞ", department, team]],
      },
    });

    return NextResponse.json({
      success: true,
      member: { name, email, phone, student_number, department, team },
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}