import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Debug cookies dengan berbagai cara
  console.log("Method 1 - req.cookies:", req.cookies.getAll());

  const cookieHeader = req.headers.get("cookie");
  console.log("Method 2 - Cookie header:", cookieHeader);

  // Parse cookie header manual jika ada
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((cookie) => {
        const [key, value] = cookie.trim().split("=");
        return [key, value];
      })
    );
    console.log("Parsed cookies:", cookies);
  }

  const accessToken = req.cookies.get("accessToken");
  console.log("Access token:", accessToken);

  const url = req.nextUrl;

  if (!accessToken && !url.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Set header di response
  const response = NextResponse.next();

  // Tambahkan header CORS
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
