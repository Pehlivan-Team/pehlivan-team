const admin = require("firebase-admin");
require("dotenv").config({ path: "./.env" });

try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Firebase Admin başlatılırken hata oluştu.", error);
  process.exit(1);
}

const db = admin.firestore();

async function initialize() {
  console.log("Kategori listesi oluşturuluyor...");
  const configRef = db.collection("config").doc("needsList");

  await configRef.set({
    departments: ["Mekanik", "Gövde", "Elektrik"],
  });

  console.log(
    "Başarıyla oluşturuldu: config/needsList dokümanı içerisine 'departments' alanı eklendi."
  );
}

initialize();
