"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CommentComposer({
  postId,
  onAdded,
}: {
  postId: string;
  onAdded?: () => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed");
      setContent("");
      onAdded?.();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border-slate-700 text-slate-100 placeholder-slate-500 md:w-[256%]"
        rows={2}
        disabled={loading}
        maxLength={256}
      />
      <div className="mt-2">
        <Button size="sm" onClick={submit} disabled={loading}>
          {loading ? "Posting..." : "Comment"}
        </Button>
      </div>
    </div>
  );
}
