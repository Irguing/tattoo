"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; desc?: string };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", desc: "Resumen rápido" },
  { href: "/admin/bookings", label: "Bookings", desc: "Reservas y estados" },
  { href: "/admin/posts", label: "Posts", desc: "Blog editorial" },
  { href: "/admin/gallery", label: "Gallery", desc: "Imágenes y metadata" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Miko Jester
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">Admin Panel</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-flex rounded-full bg-black px-2 py-0.5 font-medium text-white">
                  Dev
                </span>
                <span className="truncate">{pathname}</span>
              </div>
            </div>

            <nav className="p-2">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "group flex items-start gap-3 rounded-xl px-4 py-3 transition",
                      active ? "bg-gray-900 text-white" : "hover:bg-gray-100",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{item.label}</div>
                      {item.desc ? (
                        <div
                          className={[
                            "mt-0.5 text-xs",
                            active ? "text-white/80" : "text-gray-600",
                          ].join(" ")}
                        >
                          {item.desc}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t px-5 py-4 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Tips</span>
                <Link className="underline decoration-gray-300 hover:text-gray-900" href="/">
                  Volver al site
                </Link>
              </div>
              <p className="mt-2 leading-relaxed">
                Panel “entrevista-ready”: UI clara, acciones rápidas y feedback inmediato.
              </p>
            </div>
          </aside>

          {/* Content */}
          <section className="min-w-0">
            <div className="mb-6 flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-sm">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Admin</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {pathname === "/admin"
                    ? "Dashboard"
                    : pathname.startsWith("/admin/bookings")
                    ? "Bookings"
                    : pathname.startsWith("/admin/posts")
                    ? "Posts"
                    : pathname.startsWith("/admin/gallery")
                    ? "Gallery"
                    : "Panel"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/admin/bookings" className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50">
                  Bookings
                </Link>
                <Link href="/admin/posts" className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50">
                  Posts
                </Link>
                <Link href="/admin/gallery" className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50">
                  Gallery
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
