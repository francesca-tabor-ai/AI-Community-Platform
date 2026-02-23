import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Marketplace | AI Community Platform",
  description:
    "Extend your community with integrations. Zapier, Slack, Notion, GitHub, and more. Automate workflows and build advanced experiences—no code required.",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
