import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*", "/profile/:path*"],
};

export default function middleware(req: NextRequest) {
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Current URL:", req.url);

  const cookies = req.cookies;
  console.log("All cookies:", cookies);
  console.log("Request headers:", req.headers);

  const accessToken = req.cookies.get("accessToken")?.value;
  console.log("Access token:", accessToken);

  const url = req.nextUrl;

  if (!accessToken && !url.pathname.startsWith("/login")) {
    console.log("Redirecting to login, no token found");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
