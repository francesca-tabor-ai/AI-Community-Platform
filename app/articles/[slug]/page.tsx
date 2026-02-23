import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { auth } from "@/auth";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, summary: true, status: true },
  });
  if (!article || article.status !== "published") return { title: "Article Not Found" };
  return {
    title: `${article.title} | Knowledge Base`,
    description: article.summary ?? article.title,
  };
}

export default async function ArticleViewPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
      community: { select: { id: true, name: true, slug: true } },
      citations: true,
    },
  });

  if (!article) notFound();
  if (article.status === "draft") {
    const isAuthor = session?.user?.id === article.authorId;
    if (!isAuthor) notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/articles"
          className="text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          ← Back to Knowledge Base
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {article.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>
              {article.author.profile?.displayName || article.author.name || "Anonymous"}
            </span>
            <span>•</span>
            <span>{format(new Date(article.updatedAt), "MMMM d, yyyy")}</span>
            {article.community && (
              <>
                <span>•</span>
                <span>{article.community.name}</span>
              </>
            )}
          </div>
          {article.summary && (
            <p className="mt-4 text-lg text-slate-600">{article.summary}</p>
          )}
        </header>

        <div className="mt-10 prose prose-slate max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline">
          <div className="whitespace-pre-wrap text-slate-700">{article.body}</div>
        </div>

        {article.citations && article.citations.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10">
            <h2 className="text-lg font-semibold text-slate-900">References</h2>
            <ul className="mt-4 space-y-3">
              {article.citations.map((c) => (
                <li key={c.id} className="text-sm">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline"
                  >
                    {c.title || c.url}
                  </a>
                  {c.quote && (
                    <blockquote className="mt-1 border-l-2 border-slate-200 pl-3 text-slate-500">
                      {c.quote}
                    </blockquote>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 flex gap-4">
          <Link
            href={`/articles/${slug}/edit`}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Edit Article
          </Link>
        </div>
      </article>
    </div>
  );
}
