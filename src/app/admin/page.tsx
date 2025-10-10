import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { DashboardClientPage, Stats } from "./_components/DashboardClientPage";

async function getParticipantStats(): Promise<Stats> {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.SIGN_SHEET_ID;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !sheetId) {
      throw new Error("Katılımcı listesi için gerekli ortam değişkenleri eksik.");
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
      // HATA BURADAYDI: Veri aralığını "A2:E" yerine "A2:F" olarak güncelledik.
      range: "A2:F", 
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { totalParticipants: 0, byTeam: [], byDepartment: [] };
    }

    const stats: any = { // geçici olarak any kullandık
      totalParticipants: rows.length,
      byTeam: {},
      byDepartment: {},
    };

    rows.forEach(row => {
      const department = row[4] || 'Bilinmiyor'; // 5. sütun (E) -> Bölüm
      const team = row[5] || 'Bilinmiyor';       // 6. sütun (F) -> Takım

      stats.byTeam[team] = (stats.byTeam[team] || 0) + 1;
      stats.byDepartment[department] = (stats.byDepartment[department] || 0) + 1;
    });
    
    const sortedByTeam = Object.entries(stats.byTeam).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count);
    const sortedByDepartment = Object.entries(stats.byDepartment).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count);

    return { totalParticipants: rows.length, byTeam: sortedByTeam, byDepartment: sortedByDepartment };

  } catch (error) {
    console.error("Google Sheets'ten veri çekilirken hata:", error);
    return { totalParticipants: 0, byTeam: [], byDepartment: [] };
  }
}


export default async function AdminDashboardPage() {
  const session = await getServerSession();
  const userName = session?.user?.name?.split(" ")[0];
  const stats = await getParticipantStats();

  return (
    <div>
      <h1 className="text-3xl font-bold">Hoş Geldin, {userName}!</h1>
      <p className="mt-2 text-gray-400 mb-8">
        Aşağıda katılımcı istatistiklerini görebilirsin.
      </p>
      <DashboardClientPage initialStats={stats} />
    </div>
  );
}