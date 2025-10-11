import { firestoreAdmin } from "@/lib/firebase-admin";
import {
  AnalyticsClientPage,
  AnalyticsData,
} from "./_components/AnalyticsClientPage";
import { google } from "googleapis";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

async function getAnalyticsData(): Promise<AnalyticsData> {
  // Tüm istatistikler için varsayılan değerler
  let totalLinks = 0,
    totalClicks = 0,
    totalParticipants = 0,
    totalVisitors = 0,
    activeUsers = 0;
  let topLinks: AnalyticsData["topLinks"] = [];

  // --- Google Servisleri için Kimlik Bilgilerini Hazırla ---
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    console.error("Google servis anahtarları .env.local dosyasında eksik!");
    // Hata durumunda bile mevcut verileri döndür
    return {
      totalLinks,
      totalClicks,
      totalParticipants,
      totalVisitors,
      activeUsers,
      topLinks,
    };
  }

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  });

  try {
    // --- Firestore'dan Link İstatistikleri ---
    const linksSnapshot = await firestoreAdmin.collection("links").get();
    totalLinks = linksSnapshot.size;
    linksSnapshot.forEach((doc) => {
      totalClicks += doc.data().clicks || 0;
    });
    topLinks = linksSnapshot.docs
      .map((doc) => ({ ...(doc.data() as { slug: string; longUrl: string; clicks?: number }), id: doc.id }))
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 5)
      .map((link) => ({
        slug: link.slug,
        longUrl: link.longUrl,
        clicks: link.clicks || 0,
      }));

    // --- Google Sheets'ten Katılımcı Sayısı ---
    const sheetId = process.env.SIGN_SHEET_ID;
    if (sheetId) {
      const sheets = google.sheets({ version: "v4", auth });
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "A2:F",
      });
      totalParticipants = response.data.values?.length || 0;
    }

    // --- Google Analytics'ten Ziyaretçi Verileri ---
    const propertyId = process.env.GA_PROPERTY_ID;
    if (propertyId) {
      const analyticsDataClient = new BetaAnalyticsDataClient({ auth });
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        metrics: [{ name: "totalUsers" }, { name: "activeUsers" }],
      });
      totalVisitors = parseInt(
        response.rows?.[0]?.metricValues?.[0]?.value || "0"
      );
      activeUsers = parseInt(
        response.rows?.[0]?.metricValues?.[1]?.value || "0"
      );
    }
  } catch (error) {
    console.error("Analitik verileri çekilirken bir hata oluştu:", error);
  }

  return {
    totalLinks,
    totalClicks,
    totalParticipants,
    totalVisitors,
    activeUsers,
    topLinks,
  };
}
export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analitik & İstatistikler</h1>
      <AnalyticsClientPage initialData={data} />
    </div>
  );
}
