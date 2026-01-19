import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
