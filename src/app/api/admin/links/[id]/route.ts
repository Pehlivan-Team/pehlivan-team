import { NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is an admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Yetkiniz yok." },
        { status: 403 }
      );
    }

    const docId = params.id;
    if (!docId) {
      return NextResponse.json(
        { success: false, error: "Link ID eksik." },
        { status: 400 }
      );
    }

    // Delete the document from Firestore
    await firestoreAdmin.collection("links").doc(docId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
