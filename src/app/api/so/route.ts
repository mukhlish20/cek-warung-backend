import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* =====================================================
   POST /api/so
===================================================== */
export async function POST(req: NextRequest) {
  try {
    // AUTH (dari middleware)
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const lembar = Number(body.lembar);
    const barang_id = body.barang_id as string;
    const nama_barang = body.nama_barang as string | undefined;

    const qty_awal_pack = Number(body.qty_awal_pack);
    const qty_awal_pcs = Number(body.qty_awal_pcs);
    const qty_akhir_pack = Number(body.qty_akhir_pack);
    const qty_akhir_pcs = Number(body.qty_akhir_pcs);

    if (
      !Number.isFinite(lembar) ||
      !barang_id ||
      !Number.isFinite(qty_awal_pack) ||
      !Number.isFinite(qty_awal_pcs) ||
      !Number.isFinite(qty_akhir_pack) ||
      !Number.isFinite(qty_akhir_pcs)
    ) {
      return NextResponse.json(
        { message: "Data tidak lengkap / tidak valid" },
        { status: 400 }
      );
    }

    const barang = await prisma.barang.findUnique({
      where: { id: barang_id },
    });

    if (!barang) {
      return NextResponse.json(
        { message: "Barang tidak ditemukan" },
        { status: 404 }
      );
    }

    // LOGIC HITUNG (AMAN)
    const isiPerPack = barang.isi;

    const hargaPcs =
      barang.harga_pcs > 0
        ? barang.harga_pcs
        : Math.floor(barang.harga_pack / barang.isi);

    const total_awal_pcs =
      qty_awal_pack * isiPerPack + qty_awal_pcs;

    const total_akhir_pcs =
      qty_akhir_pack * isiPerPack + qty_akhir_pcs;

    const nilai_awal = total_awal_pcs * hargaPcs;
    const nilai_akhir = total_akhir_pcs * hargaPcs;

    const selisih_nilai = nilai_akhir - nilai_awal;

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
  } catch (error) {
    console.error("POST /api/so error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   GET /api/so
   optional ?lembar=1
===================================================== */
export async function GET(req: NextRequest) {
  try {
    // AUTH (dari middleware)
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const lembarParam = searchParams.get("lembar");

    const whereClause = lembarParam
      ? { lembar: Number(lembarParam) }
      : {};

    const data = await prisma.so_detail.findMany({
      where: whereClause,
      orderBy: [
        { lembar: "asc" },
        { nama_barang: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("GET /api/so error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
