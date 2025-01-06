import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*", "/profile/:path*"],
};

export default function middleware(req: NextRequest) {
  const accessToken =
    req.cookies.get("accessToken")?.value ||
    req.headers
      .get("cookie")
      ?.split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

  const url = req.nextUrl;

  console.log("Access Token in Middleware:", accessToken);

  // Jika tidak ada accessToken dan user mencoba mengakses halaman selain /login
  if (!accessToken && !url.pathname.startsWith("/login")) {
    // Arahkan ke halaman login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Jika ada accessToken dan user berada di halaman login, arahkan ke home
  if (accessToken && url.pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Jika token ada dan valid, lanjutkan permintaan
  return NextResponse.next();
}
