import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("JWT Token:", token);

  // ป้องกันไม่ให้คนที่ไม่ใช่ admin เข้า /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ป้องกันไม่ให้คนที่ไม่ใช่ personal เข้า /personal
  if (req.nextUrl.pathname.startsWith("/personal")) {
    if (!token || token.role !== "personal") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  const isApiProtected = req.nextUrl.pathname.startsWith("/api");

  if (isApiProtected && !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/personal/:path*", "/api/:path*"],
};
