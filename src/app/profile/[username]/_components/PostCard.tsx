"use client";

import { Post } from "@/types/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Image from "next/image";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentComposer"; // Bu muhtemelen CommentButton olmalı?
import CommentList from "./CommentList";

// YENİ IMPORT'LAR
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditPostModal from "./EditPostModal"; // Oluşturduğumuz yeni bileşen
import { useEffect } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PostCardProps {
  post: Post;
  currentUsername?: string;
}

export default function PostCard({ post, currentUsername }: PostCardProps) {
  // YENİ STATE'LER VE HOOK'LAR
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Post sahibi mi kontrolü
  const isAuthor = session?.user?.username === post.authorUsername;

  const postTime = post.createdAt?.toDate
    ? formatDistanceToNow(post.createdAt.toDate(), {
        addSuffix: true,
        locale: tr,
      })
    : "az önce";

  // SİLME İŞLEMİ
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Post silinemedi.");
      }

      toast({ title: "Başarılı!", description: "Post silindi." });
      setShowDeleteAlert(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const [name, setName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        // users collection stores username; fetch profilePictureUrl
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("username", "==", post.authorUsername),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!isMounted) return;
        if (!snap.empty) {
          const data: any = snap.docs[0].data();
          setProfilePic(data.profilePictureUrl || data.image || undefined);
          setName(data.name || "");
        }
      } catch {}
    }
    if (post.authorUsername) loadProfile();
    return () => {
      isMounted = false;
    };
  }, [post.authorUsername]);

  return (
    <>
      <article className="flex w-full gap-3 p-4 border-b border-slate-700 bg-slate-900 rounded">
        <Avatar>
          <AvatarImage src={profilePic} />
          <AvatarFallback>{post.authorUsername?.[0]}</AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${post.authorUsername}`}
                className="font-bold hover:underline"
              >
                {name || post.authorUsername}
              </Link>
              <span className="text-sm text-muted-foreground">
                @{post.authorUsername}
              </span>
              <span className="text-sm text-muted-foreground">·</span>
            </div>
            {/* YENİ: DROPDOWN MENÜ (SADECE YAZAR GÖRÜR) */}
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Düzenle</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteAlert(true)}
                    className="text-red-500"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Sil</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="whitespace-pre-wrap text-white">{post.content}</p>

          {post.imageUrl && (
            <div className="relative w-full h-auto aspect-[16/9] mt-2 rounded-lg border border-slate-700 overflow-hidden">
              <Image
                src={post.imageUrl}
                alt="Post resmi"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}

          <div className="flex gap-4 mt-3">
            <LikeButton postId={post.id} initialCount={post.likeCount} />
            <CommentButton postId={post.id} />
          </div>

          <CommentList postId={post.id} />
        </div>
      </article>

      {/* YENİ: SİLME ONAY MODALI */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Postunuz kalıcı olarak silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* YENİ: DÜZENLEME MODALI */}
      {isAuthor && showEditModal && (
        <EditPostModal
          post={post}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
      )}
      <span className="text-sm text-muted-foreground hover:underline">
        {postTime}
      </span>
    </>
  );
}
