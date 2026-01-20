import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Ambil user dari middleware
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const barangs = await prisma.barang.findMany({
      select: {
        id: true,
        nama: true,
        isi: true,
        harga_pack: true,
        harga_pcs: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(barangs);
  } catch (e: any) {
    console.error("❌ Barang GET Error:", e);
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ success: true, data: body });
}
