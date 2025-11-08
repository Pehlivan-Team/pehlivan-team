import { NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firebase-admin";
import admin from "firebase-admin";

// Contract:
// GET /api/search?q=term&types=users,posts&limit=10
// Returns { users: [...], posts: [...], meta: { tookMs, q, types } }
// NOTE: Firestore doesn't support true LIKE; we approximate with prefix matches using >= and < bounds.

function buildPrefixRange(value: string) {
  // For prefix search we use: where(field >= value, field < value + \uf8ff)
  // Sanitise and lower-case.
  const v = value.trim().toLowerCase();
  return { start: v, end: v + "\uf8ff" };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const typesParam = (url.searchParams.get("types") || "users,posts").toLowerCase();
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "10", 10), 25);
  const types = typesParam.split(",").map((t) => t.trim()).filter(Boolean);

  if (!q) {
    return NextResponse.json({ users: [], posts: [], meta: { q, types, tookMs: 0 } });
  }

  const t0 = Date.now();
  const { start, end } = buildPrefixRange(q);

  const results: { users: any[]; posts: any[] } = { users: [], posts: [] };

  // NOTE: For better ranking you might store a 'searchIndex' field pre-normalised.
  try {
    if (types.includes("users")) {
      // Search by username OR name prefix (two queries merged)
      const usernameQuery = await firestoreAdmin
        .collection("users")
        .where("username_lower", ">=", start)
        .where("username_lower", "<=", end)
        .limit(limit)
        .get();

      const nameQuery = await firestoreAdmin
        .collection("users")
        .where("name_lower", ">=", start)
        .where("name_lower", "<=", end)
        .limit(limit)
        .get();

      const userDocs = [...usernameQuery.docs, ...nameQuery.docs];
      const seen = new Set<string>();
      results.users = userDocs
        .filter((d) => {
          if (seen.has(d.id)) return false;
          seen.add(d.id);
          return true;
        })
        .slice(0, limit)
        .map((d) => {
          const data: any = d.data();
          return {
            id: d.id,
            username: data.username,
            name: data.name,
            profilePictureUrl: data.profilePictureUrl || data.image || "",
            team: data.team || "",
          };
        });
    }

    if (types.includes("posts")) {
      // Search profile posts only (exclude blog posts) using content_lower prefix
      const postQuery = await firestoreAdmin
        .collection("posts")
        .where("content_lower", ">=", start)
        .where("content_lower", "<=", end)
        .orderBy("content_lower")
        .limit(limit)
        .get();

      results.posts = postQuery.docs.map((d) => {
        const data: any = d.data();
        return {
          id: d.id,
            authorUsername: data.authorUsername,
            content: data.content,
            imageUrl: data.imageUrl || null,
            likeCount: data.likeCount || 0,
            commentCount: data.commentCount || 0,
        };
      });
    }
  } catch (e: any) {
    console.error("Search error", e);
    return NextResponse.json(
      { error: "search_failed", message: e.message, meta: { q, types } },
      { status: 500 }
    );
  }

  const tookMs = Date.now() - t0;
  return NextResponse.json({ ...results, meta: { q, types, tookMs } });
}
