import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const cookeStore = await cookies();
  const tes = cookeStore.getAll();
  console.log("Cookies Store Next Header", tes);

  const accessToken = req.cookies.get("accessToken");
  console.log("Access token:", accessToken);

  const url = req.nextUrl;

  if (!accessToken && !url.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*", "/profile/:path*"],
};
