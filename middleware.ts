import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*", "/profile/:path*"],
};

export default function middleware(req: NextRequest) {
  console.log("Cookies", req.cookies);

  const accessToken = req.cookies.get("accessToken")?.value;
  const url = req.nextUrl;

  if (!accessToken && !url.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
