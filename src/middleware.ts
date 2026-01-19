import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  console.log("🔥 MIDDLEWARE HIT:", req.nextUrl.pathname);

  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "NO AUTH HEADER" },
      { status: 401 }
    );
  }

  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "NOT BEARER" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { message: "INVALID TOKEN" },
      { status: 401 }
    );
  }
}
