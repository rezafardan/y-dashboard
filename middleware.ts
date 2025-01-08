import { NextRequest, NextResponse } from "next/server";
import {
  setCookie,
  getCookie,
  deleteCookie,
  hasCookie,
  getCookies,
} from "cookies-next/server";

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Menyeting cookie 'test' untuk percobaan
  await setCookie("test", "value", { res, req });

  // Mengecek apakah cookie 'test' ada
  const hasTestCookie = await hasCookie("test", { req, res });
  console.log("Has test cookie:", hasTestCookie);

  // Mengambil cookie 'test' untuk pengecekan
  const testCookie = await getCookie("test", { req, res });
  console.log("Test cookie value:", testCookie);

  // Mengambil semua cookies
  const allCookies = await getCookies({ req, res });
  console.log("All cookies:", allCookies);

  // Log informasi mengenai cookies dari request
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Current URL:", req.url);

  const cookies = req.cookies;
  console.log("Cookies received:", cookies);

  const accessToken = req.cookies.get("accessToken")?.value;
  console.log("Access token:", accessToken);

  const url = req.nextUrl;

  // Pengecekan akses token dan pengalihan berdasarkan URL
  if (!accessToken && !url.pathname.startsWith("/login")) {
    console.log("Redirecting to login, no token found");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/blogs/:path*", "/users/:path*", "/profile/:path*"],
};
