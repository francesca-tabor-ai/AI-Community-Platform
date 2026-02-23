import { CommunitySidebar } from "./CommunitySidebar";

export default async function CommunityAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex gap-8">
      <aside className="w-56 shrink-0">
        <CommunitySidebar slug={slug} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
