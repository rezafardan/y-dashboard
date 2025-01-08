import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Debug semua headers
  console.log("All Headers:", Object.fromEntries(req.headers));

  // Cek cookie header mentah
  const cookieHeader = req.headers.get("cookie");
  console.log("Raw Cookie Header:", cookieHeader);

  const accessToken = req.cookies.get("accessToken");
  console.log("Access token:", accessToken);

  const url = req.nextUrl;

  // Tambahkan logging untuk URL
  console.log("Current URL:", url.pathname);

  if (!accessToken && !url.pathname.startsWith("/login")) {
    console.log("Redirecting to login - No token found");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && url.pathname === "/login") {
    console.log("Redirecting to home - Token exists");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Set response dengan header yang tepat
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://backend-sable-mu.vercel.app"
  );

  return response;
}

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*", "/profile/:path*"],
};
