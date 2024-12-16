import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // Jika di halaman login dan sudah punya token, redirect ke beranda
  if (accessToken && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jika tidak punya token dan bukan halaman login
  if (!accessToken && req.nextUrl.pathname !== "/login") {
    // Cek apakah masih punya refresh token
    if (refreshToken) {
      // Lanjutkan request, biarkan frontend/backend yang handle refresh
      return NextResponse.next();
    }

    // Redirect ke login jika tidak punya token sama sekali
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*"],
};
