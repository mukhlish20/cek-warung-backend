import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ALLOWED_ORIGIN = "https://cek-warung-android.vercel.app";

export async function middleware(req: NextRequest) {
  /* =========================
     CORS HEADERS
  ========================= */
  const corsHeaders = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Response default
  const res = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });

  /* =========================
     BYPASS LOGIN
  ========================= */
  if (req.nextUrl.pathname === "/api/auth/login") {
    return res;
  }

  /* =========================
     AUTH JWT
  ========================= */
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.id as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: { headers: requestHeaders },
      headers: corsHeaders,
    });
  } catch {
    return NextResponse.json(
      { message: "Token tidak valid" },
      { status: 401, headers: corsHeaders }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
