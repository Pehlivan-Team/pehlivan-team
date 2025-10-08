import { NextRequest } from "next/server";
import { google } from "googleapis";

export async function POST(request: NextRequest) {
  const { name, email, phone, student_number, department, team } =
    await request.json();
  if (!name || !phone || !student_number || !team || !department)
    return Response.json({ success: false, error: "ERR_MISSING_FIELDS" });
  try {
    console.log(process.env.GOOGLE_PRIVATE_KEY);

    const googleAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ) as string,
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth: googleAuth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SIGN_SHEET_ID!,
      range: "A1:E1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            name,
            student_number,
            phone,
            email ? email : "BOŞ",
            department,
            team ? team : "BOŞ",
          ],
        ],
      },
    });

    return Response.json({
      success: true,
      error: "",
      member: { name, email, phone, student_number, department },
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: (error as Error).message,
      member: null,
    });
  }
}
