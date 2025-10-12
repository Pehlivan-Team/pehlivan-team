import { NextRequest, NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PROJE GÜNCELLEME (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.permissions?.canManageProjects) {
      return NextResponse.json(
        { success: false, error: "Yetkiniz yok." },
        { status: 403 }
      );
    }
    const docId = params.id;
    const body = await request.json();
    await firestoreAdmin.collection("projects").doc(docId).update(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Güncelleme sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

// PROJE SİLME (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.permissions?.canManageProjects) {
      return NextResponse.json(
        { success: false, error: "Yetkiniz yok." },
        { status: 403 }
      );
    }
    const docId = params.id;
    await firestoreAdmin.collection("projects").doc(docId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Silme sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
