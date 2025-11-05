import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { firestoreAdmin } from "@/lib/firebase-admin";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { postId: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const postRef = firestoreAdmin.collection("posts").doc(params.postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    const data = postSnap.data() as any;
    if (data.authorId !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await postRef.delete();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Delete post error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
