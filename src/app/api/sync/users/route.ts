import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      password: true,
      role: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(users);
}
