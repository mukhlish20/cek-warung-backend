import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  // Kalau tidak ada token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: string;
    };

    // Sisipkan info user ke header
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.id);
    requestHeaders.set("x-user-role", decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

// ⬇️ INI WAJIB
export const config = {
  matcher: [
    "/api/barang/:path*",
    "/api/users/:path*",
    "/api/so/:path*",
    "/api/sync/:path*",
  ],
};
