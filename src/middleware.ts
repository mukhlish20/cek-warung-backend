import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  return NextResponse.json({
    path: req.nextUrl.pathname,
    hasAuthHeader: req.headers.has("authorization"),
    authHeader: req.headers.get("authorization"),
    jwtSecretExists: !!process.env.JWT_SECRET,
  });
}

export const config = {
  matcher: ["/api/barang"],
};
