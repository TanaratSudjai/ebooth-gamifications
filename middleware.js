import { NextResponse } from "next/server";

export function middleware(req) {
  // ดึงค่า token จาก cookies
  const token = req.cookies.get("next-auth.session-token")?.value;
  console.log("Token:", token); // แสดงค่า token ใน console

  // ถ้าไม่มี token และกำลังเข้าถึงหน้า admin

  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    // รีไดเร็กต์ไปที่หน้าแรกหรือหน้า login
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!token && req.nextUrl.pathname.startsWith("/member")) {
    // รีไดเร็กต์ไปที่หน้าแรกหรือหน้า login
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ถ้ามี token หรือไม่ใช่หน้า admin ก็ให้ผ่าน
  return NextResponse.next();
}

export const config = {
  // กำหนดให้ middleware ทำงานกับ path /admin และทุก path ย่อย
  matcher: ["/admin/:path*"],
};
