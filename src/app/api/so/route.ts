import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // =====================
    // AUTH (SESUAI PROJECT)
    // =====================
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // =====================
    // BODY
    // =====================
    const body = await req.json();
    const {
      lembar,
      barang_id,
      nama_barang,
      qty_awal_pack,
      qty_awal_pcs,
      qty_akhir_pack,
      qty_akhir_pcs,
    } = body;

    if (
      lembar === undefined ||
      !barang_id ||
      qty_awal_pack === undefined ||
      qty_awal_pcs === undefined ||
      qty_akhir_pack === undefined ||
      qty_akhir_pcs === undefined
    ) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // =====================
    // BARANG
    // =====================
    const barang = await prisma.barang.findUnique({
      where: { id: barang_id },
    });

    if (!barang) {
      return NextResponse.json(
        { message: "Barang tidak ditemukan" },
        { status: 404 }
      );
    }

    // =====================
    // HITUNG ULANG
    // =====================
    const total_awal_pcs =
      qty_awal_pack * barang.isi + qty_awal_pcs;

    const total_akhir_pcs =
      qty_akhir_pack * barang.isi + qty_akhir_pcs;

    const nilai_awal =
      total_awal_pcs * barang.harga_pcs;

    const nilai_akhir =
      total_akhir_pcs * barang.harga_pcs;

    const selisih_nilai =
      nilai_akhir - nilai_awal;

    // =====================
    // SIMPAN
    // =====================
    const result = await prisma.so_detail.create({
      data: {
        lembar,
        barang_id,
        nama_barang: nama_barang ?? barang.nama,

        qty_awal_pack,
        qty_awal_pcs,
        qty_akhir_pack,
        qty_akhir_pcs,

        total_awal_pcs,
        total_akhir_pcs,
        nilai_awal,
        nilai_akhir,
        selisih_nilai,
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("POST /api/so error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
