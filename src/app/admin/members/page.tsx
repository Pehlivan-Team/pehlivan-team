import { google } from "googleapis";
import { MembersClientPage } from "./_components/MembersClientPage";

export interface Participant {
  name: string;
  student_number: string;
  phone: string;
  email: string;
  department: string;
  team: string;
}

const PARTICIPANTS_PER_PAGE = 15;

async function getFilteredParticipants({
  page = 1,
  searchTerm = "",
  teamFilter = "",
}) {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.SIGN_SHEET_ID;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !sheetId) {
      throw new Error(
        "Katılımcı listesi için gerekli ortam değişkenleri eksik."
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A2:F",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { participants: [], totalPages: 0, currentPage: 1, allTeams: [] };
    }

    const allParticipants: Participant[] = rows
      .map((row) => ({
        name: row[0] || "",
        student_number: row[1] || "",
        phone: row[2] || "",
        email: row[3] || "",
        department: row[4] || "",
        team: row[5] || "",
      }))
      .reverse();

    const allTeams = Array.from(
      new Set(allParticipants.map((p) => p.team).filter((t) => t))
    ).sort();

    const filtered = allParticipants.filter((p) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(searchLower) ||
        p.department.toLowerCase().includes(searchLower) ||
        p.student_number.includes(searchLower);

      const matchesFilter = !teamFilter || p.team === teamFilter;

      return matchesSearch && matchesFilter;
    });

    const totalParticipants = filtered.length;
    const totalPages = Math.ceil(totalParticipants / PARTICIPANTS_PER_PAGE);

    const startIndex = (page - 1) * PARTICIPANTS_PER_PAGE;
    const endIndex = startIndex + PARTICIPANTS_PER_PAGE;
    const participantsForPage = filtered.slice(startIndex, endIndex);

    return {
      participants: participantsForPage,
      totalPages,
      currentPage: page,
      allTeams,
    };
  } catch (error) {
    console.error(
      "Google Sheets'ten katılımcı verileri çekilirken hata:",
      error
    );
    return { participants: [], totalPages: 0, currentPage: 1, allTeams: [] };
  }
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const searchTerm = searchParams.search || "";
  const teamFilter = searchParams.team || "";

  const { participants, totalPages, currentPage, allTeams } =
    await getFilteredParticipants({ page, searchTerm, teamFilter });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Katılımcı Listesi</h1>
      <p className="text-muted-foreground mb-4">
        "Bize Katıl" formu üzerinden başvuran tüm katılımcıların listesi.
      </p>
      <MembersClientPage
        initialParticipants={participants}
        totalPages={totalPages}
        currentPage={currentPage}
        allTeams={allTeams}
      />
    </div>
  );
}
