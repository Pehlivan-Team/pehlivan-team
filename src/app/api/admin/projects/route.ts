import { NextRequest, NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import admin from "firebase-admin";

// YENİ PROJE OLUŞTURMA (POST)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.permissions?.canManageProjects) {
      return NextResponse.json(
        { success: false, error: "Yetkiniz yok." },
        { status: 403 }
      );
    }
    const body = await request.json();
    const newProject = await firestoreAdmin.collection("projects").add({
      ...body,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true, id: newProject.id });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Bilinmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
