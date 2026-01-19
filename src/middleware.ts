import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET as string
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Login PUBLIC
  if (pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    await jwtVerify(token, secret);
    return NextResponse.next(); // 🔥 LANJUT KE ROUTE
  } catch {
    return NextResponse.json(
      { message: "Token tidak valid" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
