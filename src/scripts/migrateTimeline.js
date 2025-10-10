const admin = require('firebase-admin');
require('dotenv').config({ path: './.env' });

// --- Firebase Admin SDK'yı Başlatma ---
try {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.error("Firebase Admin başlatılırken hata oluştu. .env.local dosyanızı kontrol edin.", error);
    process.exit(1);
}

const db = admin.firestore();

// --- Firestore'a Aktarılacak Tarihçe Verisi ---
// Yerel resim yollarını public URL'lere dönüştürdük.
const timelineEvents = [
  {
    year: "2014",
    order: 1, // Sıralama için bir alan ekliyoruz
    title: "Pehlivan Solar & İlk Başarılar",
    description: "Takımımızın ilk aracı olan Pehlivan Solar ile yola çıktık. Katıldığımız ilk yarış olan Formula G'de 'Kurul Özel Ödülü' ve TÜBİTAK yarışında '3.lük Ödülü' kazanarak güçlü bir başlangıç yaptık.",
    image: "/arabalar/solar2.jpg",
    awards: ["Formula G - Kurul Özel Ödülü", "TÜBİTAK - 3.lük Ödülü"],
  },
  {
    year: "2015",
    order: 2,
    title: "Elektrak & Tasarım Ödülü",
    description: "İkinci aracımız Elektrak'ı geliştirdik ve katıldığı ilk TÜBİTAK Efficiency Challenge'da 'Tasarım Ödülü'nü kazandık.",
    image: "https://bys.trakya.edu.tr/cache/img-thumb/a/af/af9/af9d/af9dee9a6229799a047998db29ff848f.png",
    awards: ["TÜBİTAK - Tasarım Ödülü"],
  },
  {
    year: "2016",
    order: 3,
    title: "Balkan Turu ve Yeni Başarılar",
    description: "Elektrak ile 5 ülkeyi kapsayan bir Balkan Turu'na çıktık ve uluslararası alanda tanınırlık kazandık. Aynı yıl TÜBİTAK Efficiency Challenge'da 'İkincilik Ödülü' ve 'En İyi Sunum Ödülü'nü alarak başarılarımızı taçlandırdık.",
    image: "https://bys.trakya.edu.tr/cache/img-thumb/a/af/af9/af9d/af9dee9a6229799a047998db29ff848f.png",
    awards: ["TÜBİTAK - İkincilik Ödülü", "TÜBİTAK - En İyi Sunum Ödülü"],
  },
  {
    year: "2019",
    order: 4,
    title: "Pehlivan Monte & Avrupa Macerası",
    description: "Üçüncü aracımız Pehlivan Monte ile Shell Eco Marathon Avrupa'ya katılma hakkı kazanarak uluslararası arenada yeniden boy gösterdik.",
    image: "/arabalar/mavi2.jpeg",
    awards: ["Shell ECO Marathon - Katılım Hakkı"],
  },
  {
    year: "2021",
    order: 5,
    title: "Pehlivan MONTE-RC",
    description: "COVID-19 sürecinin zorluklarına rağmen dördüncü aracımız MONTE-RC'yi geliştirdik ve TÜBİTAK Efficiency Challenge'a katıldık.",
    image: "/arabalar/sarı1.jpeg",
    awards: ["TÜBİTAK - Katılım Hakkı"],
  },
  {
    year: "2024 - Günümüz",
    order: 6,
    title: "Yeni Proje: Pehli1",
    description: "En güncel projemiz olan Pehli1 üzerinde çalışmalarımıza devam ediyoruz. Bu araçla TÜBİTAK Efficiency Challenge'da yeni başarılara imza atmayı hedefliyoruz.",
    image: "/arabalar/pehli1.png",
    awards: ["Geliştirme Aşamasında"],
  },
];


// --- Verileri Aktaran Ana Fonksiyon ---
async function migrateTimelineData() {
    console.log('Tarihçe verilerini Firestore\'a aktarma işlemi başlıyor...');
    const collectionRef = db.collection('timeline');
    const batch = db.batch();

    timelineEvents.forEach(event => {
        const docRef = collectionRef.doc(); // Otomatik ID ile yeni bir doküman referansı oluştur
        batch.set(docRef, event);
    });

    try {
        await batch.commit();
        console.log(`\nİşlem tamamlandı. Toplam ${timelineEvents.length} adet tarihçe olayı başarıyla Firestore'a aktarıldı.`);
    } catch (error) {
        console.error('HATA: Veriler Firestore\'a yazılırken bir sorun oluştu.', error);
    }
}

migrateTimelineData();