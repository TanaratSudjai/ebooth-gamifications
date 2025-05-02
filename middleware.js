import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ตรวจสอบว่าเข้าหน้า /admin และไม่ใช่ admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token || token.is_admin !== 1) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ถ้าเข้าหน้า /personal ต้อง login เท่านั้น
  if (req.nextUrl.pathname.startsWith("/personal") && !token) {
    if (!token || token.is_admin !== 2) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/personal/:path*"],
};
