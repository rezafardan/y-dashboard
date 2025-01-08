import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // Log raw cookie header
  console.log("Raw cookie header:", req.headers.get("cookie"));

  // Log parsed cookies
  const cookieStore: any = req.cookies;
  console.log("Parsed cookies:", [...cookieStore.entries()]);

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
    return NextResponse.redirect(new URL("/", req.url), {
      headers: {
        getSetCookie: accessToken,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*", "/profile/:path*"],
};
