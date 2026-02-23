import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Enterprise", href: "/enterprise" },
  ],
  developers: [
    { label: "API Docs", href: "/api-docs" },
    { label: "App Marketplace", href: "/marketplace" },
    { label: "Build an App", href: "/marketplace/apply" },
    { label: "Developers", href: "/developers" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  company: [
    { label: "Contact", href: "/contact" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-slate-900 transition-colors hover:text-violet-600"
        >
          <Image
            src="/logo.svg"
            alt="AI Community Platform"
            width={28}
            height={28}
            className="shrink-0"
          />
          <span className="font-semibold">AI Community Platform</span>
        </Link>
        <div className="mt-12 flex flex-col gap-12 sm:flex-row sm:flex-wrap sm:gap-x-16">
          <div>
            <h3 className="font-semibold text-slate-900">Product</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-violet-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Developers</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.developers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-violet-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Resources</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-violet-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Company</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-violet-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-slate-200 pt-8 text-sm text-slate-500">
          © {new Date().getFullYear()} AI Community Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
