import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { cookies } = req;
  const authToken = cookies.get("authToken");
  const userRole = cookies.get("role");

  console.log(cookies);

  if (authToken && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(`${req.nextUrl.origin}/`);
  }

  if (!authToken && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*"],
};
