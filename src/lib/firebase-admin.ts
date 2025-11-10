import admin from 'firebase-admin'

// Uygulama zaten başlatıldıysa, mevcut uygulama kullanılır.
if (admin.apps.length) {
  // Hiçbir şey yapma, zaten başlatıldı
} else {
  // Başlatılmamışsa, başlatmayı dene.
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }

    // Gerekli ortam değişkenlerinin mevcut olup olmadığını kontrol et
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error(
        'Firebase service account environment variables are not set or are incorrect.'
      )
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } catch (error: any) {
    // Hata olursa, ayrıntılı bir hata mesajı at
    // Normalde bu hata oluşmamalıdır çünkü ortam değişkenleri kontrol edilir ancak hata olursa ve error mesajı atılmazsa
    // ne olduğunu anlamak zor olabilir. Inan böylesi daha iyi.
    throw new Error(`Firebase Admin Initialization Error: ${error.message}`)
  }
}

// Başlatılmış firestore örneğini dışa aktar
export const firestoreAdmin = admin.firestore()
