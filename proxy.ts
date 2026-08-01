import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

async function refreshAdminSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // This validates/refreshes the auth token before an admin Server Component
  // reads it. Do not put unrelated work between client creation and getUser().
  await supabase.auth.getUser();
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return refreshAdminSession(request);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/donate") ||
    pathname.startsWith("/lottie") ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.png" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|avif|gif)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/vi") || pathname.startsWith("/en")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/vi${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
