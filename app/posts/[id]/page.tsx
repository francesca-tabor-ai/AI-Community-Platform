"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import RichTextEditor from "@/app/components/RichTextEditor";

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    profile: { displayName: string | null; avatarUrl: string | null } | null;
  };
  replies: Comment[];
};

type Post = {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    profile: { displayName: string | null; avatarUrl: string | null } | null;
  };
  space: { name: string; slug: string };
  community: { name: string; slug: string };
};

export default function PostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetch(`/api/posts/${id}`, { credentials: "include", signal: controller.signal }),
      fetch(`/api/posts/${id}/comments`, { credentials: "include", signal: controller.signal }),
    ])
      .then(async ([postRes, commentsRes]) => {
        if (postRes.status === 401) {
          window.location.href = `/login?callbackUrl=${encodeURIComponent(`/posts/${id}`)}`;
          return;
        }
        const postData = await postRes.json();
        setPost(postData);

        if (commentsRes.ok) {
          const { comments: commData } = await commentsRes.json();
          setComments(commData ?? []);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  const handleSubmitComment = async (parentId?: string) => {
    const bodyToSend = parentId ? replyBody : commentBody;
    if (!bodyToSend.trim()) return;
    setSubmitting(true);

    const res = await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: bodyToSend.trim(), parentId }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      if (parentId) {
        setReplyBody("");
        setReplyingTo(null);
      } else {
        setCommentBody("");
      }
      setComments((prev) => {
        const newComment = {
          ...data,
          replies: [],
        };
        if (parentId) {
          return prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...c.replies, newComment] }
              : c
          );
        }
        return [...prev, newComment];
      });
    }
    setSubmitting(false);
  };

  const authorName = (c: Comment) =>
    c.author?.profile?.displayName || c.author?.name || "Anonymous";

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        <Link href="/communities" className="mt-6 inline-block text-violet-600 hover:text-violet-700">
          Browse communities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href={`/communities/${post.community.slug}/spaces/${post.space.slug}`}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to #{post.space.name}
        </Link>

        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <span>{post.author?.profile?.displayName || post.author?.name || "Anonymous"}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>·</span>
            <Link
              href={`/communities/${post.community.slug}`}
              className="text-violet-600 hover:text-violet-700"
            >
              {post.community.name}
            </Link>
          </div>
          <div
            className="mt-6 prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">
            Comments ({comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)})
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <RichTextEditor
                content={commentBody}
                onChange={setCommentBody}
                placeholder="Write a comment..."
              />
              <button
                onClick={() => handleSubmitComment()}
                disabled={submitting || !commentBody.trim()}
                className="mt-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Comment"}
              </button>
            </div>

            {comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-medium text-slate-900">{authorName(comment)}</span>
                    <span className="ml-2 text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-violet-600 hover:text-violet-700"
                  >
                    Reply
                  </button>
                </div>
                <div
                  className="mt-2 text-sm text-slate-600"
                  dangerouslySetInnerHTML={{ __html: comment.body }}
                />
                {replyingTo === comment.id && (
                  <div className="mt-4">
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder="Write a reply..."
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleSubmitComment(comment.id)}
                        disabled={submitting || !replyBody.trim()}
                        className="rounded-lg bg-violet-500 px-3 py-1.5 text-sm text-white hover:bg-violet-600 disabled:opacity-50"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyBody("");
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {comment.replies?.map((reply) => (
                  <div
                    key={reply.id}
                    className="mt-4 ml-6 border-l-2 border-slate-100 pl-4"
                  >
                    <span className="font-medium text-slate-900">{authorName(reply)}</span>
                    <span className="ml-2 text-xs text-slate-500">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                    <div
                      className="mt-1 text-sm text-slate-600"
                      dangerouslySetInnerHTML={{ __html: reply.body }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
