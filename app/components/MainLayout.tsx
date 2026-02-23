"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      {children}
      <Footer />
      <ChatWidget />
    </>
  );
}
