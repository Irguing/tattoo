import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { newRequestId, REQUEST_ID_HEADER } from "@/lib/observability";

function getSessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME?.trim() || "admin_session";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  const requestId = requestHeaders.get(REQUEST_ID_HEADER) ?? newRequestId();
  requestHeaders.set(REQUEST_ID_HEADER, requestId);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  res.headers.set(REQUEST_ID_HEADER, requestId);

  // =========================
  // Security headers (global)
  // =========================
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-site");

  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // =========================
  // Admin redirect guard (UX)
  // =========================
  if (pathname === "/admin/login") {
    return res;
  }

  if (pathname.startsWith("/admin")) {
    const cookieName = getSessionCookieName();
    const session = req.cookies.get(cookieName)?.value;

    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      const redirect = NextResponse.redirect(url);
      redirect.headers.set(REQUEST_ID_HEADER, requestId);
      return redirect;
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
