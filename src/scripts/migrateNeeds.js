const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
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
const scriptsDir = path.join(__dirname); // Script'in bulunduğu dizin

// --- CSV Dosyalarını Oku ve Firestore'a Yükle ---
async function migrateData() {
    console.log('CSV dosyalarından Firestore\'a veri aktarımı başlıyor...');
    const departments = ['mekanik', 'govde', 'elektrik'];
    let totalItemsAdded = 0;

    for (const department of departments) {
        const filePath = path.join(scriptsDir, `${department}.csv`);
        
        if (!fs.existsSync(filePath)) {
            console.warn(`UYARI: ${filePath} dosyası bulunamadı. Bu departman atlanıyor.`);
            continue;
        }

        console.log(`\n[${department}] departmanı için ${department}.csv dosyası işleniyor...`);
        const collectionRef = db.collection(department);
        let departmentCount = 0;

        const stream = fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (row) => {
                // Her satır için yeni bir doküman oluştur
                const newItem = {
                    part_name: row.part_name || 'İsimsiz Ürün',
                    quantity: parseInt(row.quantity, 10) || 1,
                    price: parseFloat(row.price) || 0,
                    link: row.link || '',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                };
                
                // Veriyi Firestore'a ekle
                await collectionRef.add(newItem);
                departmentCount++;
            })
            .on('end', () => {
                console.log(`[${department}] departmanına ${departmentCount} ürün başarıyla eklendi.`);
                totalItemsAdded += departmentCount;
            });
        
        // Stream'in bitmesini bekle
        await new Promise(resolve => stream.on('finish', resolve));
    }
    
    // Not: Bu mesaj, asenkron işlemler bittiğinde tam doğru sayıyı göstermeyebilir,
    // ancak her departman için ayrı ayrı doğru sayıyı göreceksiniz.
    console.log(`\nİşlem tamamlandı. Detaylar yukarıda listelenmiştir.`);
}

migrateData();