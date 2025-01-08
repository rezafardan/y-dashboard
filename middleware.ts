import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Jika pengguna membuka root atau halaman lain selain /login, redirect ke /login
  if (pathname === "/" || !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika pengguna sudah di /login, teruskan request
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Cocokkan semua route
};
