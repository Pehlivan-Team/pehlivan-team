import { firestoreAdmin } from "@/lib/firebase-admin"; //
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, name } = await req.json();

    if (!email || !password || !username || !name) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    // 1. Kullanıcı adı benzersiz mi?
    const usernameQuery = await firestoreAdmin
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();
    if (!usernameQuery.empty) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı zaten alınmış." },
        { status: 409 }
      );
    }

    // 2. E-posta zaten kayıtlı mı?
    const userRef = firestoreAdmin.collection("users").doc(email);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı." },
        { status: 409 }
      );
    }

    // 3. Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Yeni kullanıcı profilini oluştur
    const newUserProfile = {
      email: email,
      name: name,
      username: username,
      hashedPassword: hashedPassword, // <-- Şifreyi burada saklıyoruz
      image: "", // Varsayılan resim
      bio: "",
      team: "",
      profilePictureUrl: "",
      socialLinks: {},
    };

    await userRef.set(newUserProfile);

    return NextResponse.json(
      { success: true, message: "Kullanıcı başarıyla oluşturuldu." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt olma hatası:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}