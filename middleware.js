import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;
  console.log(token);

  if (path.startsWith("/api/auth") || path === "/login") {
    return NextResponse.next();
  }

  if (path.startsWith("/admin") && (!token || token?.role !== "admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (path.startsWith("/personal") && (!token || token?.role !== "personal")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/member") && (!token || token?.role !== "member")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔒 Protect API
  // if (path.startsWith("/api") && !token) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/admin/:path*",
    "/personal/:path*",
    "/api/:path*", 
    "/login", 
  ],
};
