import { NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createPostSchema } from "@/lib/validation/posts"; // PostValidation'ı import et

// Mevcut GET fonksiyonunuz...
export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  // ... (Bu fonksiyon aynı kalıyor)
}

// YENİ: POST SİLME FONKSİYONU
export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 });
  }

  const { postId } = params;
  if (!postId) {
    return NextResponse.json({ error: "Post ID gerekli" }, { status: 400 });
  }

  try {
    const postRef = firestoreAdmin.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post bulunamadı" }, { status: 404 });
    }

    const post = postDoc.data();

    // Yetki Kontrolü: Sadece postun sahibi silebilir
    if (post?.authorUsername !== session.user.username) {
      return NextResponse.json(
        { error: "Bu işlemi yapma yetkiniz yok" },
        { status: 403 }
      );
    }

    // TODO: İlişkili resimleri EdgeStore'dan silme
    // if (post.imageUrl) { ... }

    // await deleteSubcollection(postRef.collection("comments"));

    await postRef.delete();

    return NextResponse.json(
      { message: "Post başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Post silme hatası:", error);
    return NextResponse.json(
      { error: "Dahili sunucu hatası" },
      { status: 500 }
    );
  }
}

// YENİ: POST DÜZENLEME FONKSİYONU
export async function PUT(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 });
  }

  const { postId } = params;
  if (!postId) {
    return NextResponse.json({ error: "Post ID gerekli" }, { status: 400 });
  }

  try {
    const parsedBody = createPostSchema.safeParse(await req.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.format() },
        { status: 400 }
      );
    }

    // Düzenlemede sadece 'content' ve 'imageUrl' güncellenebilir
    const { content, imageUrl } = parsedBody.data;

    const postRef = firestoreAdmin.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post bulunamadı" }, { status: 404 });
    }

    const post = postDoc.data();

    // Yetki Kontrolü: Sadece postun sahibi düzenleyebilir
    if (post?.authorUsername !== session.user.username) {
      return NextResponse.json(
        { error: "Bu işlemi yapma yetkiniz yok" },
        { status: 403 }
      );
    }

    // Veriyi güncelle
    await postRef.update({
      content: content,
      imageUrl: imageUrl || null, // Varsa imageUrl'i güncelle
    });

    const updatedDoc = await postRef.get();

    return NextResponse.json({ post: updatedDoc.data() }, { status: 200 });
  } catch (error) {
    console.error("Post güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Dahili sunucu hatası" },
      { status: 500 }
    );
  }
}
