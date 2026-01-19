import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Biarkan login & public route lewat
  if (
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/public")
  ) {
    return NextResponse.next();
  }

  // 🔐 Proteksi semua /api/*
  if (pathname.startsWith("/api")) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json(
        { message: "Token tidak valid" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
