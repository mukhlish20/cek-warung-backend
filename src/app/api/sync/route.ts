import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const { table, action, data } = payload;

    /* =========================
       BARANG
    ========================= */
    if (table === "barang") {
      if (action === "upsert") {
        await prisma.barang.upsert({
          where: { nama: data.nama },
          update: {
            nama: data.nama,
            isi: data.isi,
            harga_pack: data.harga_pack,
            harga_pcs: data.harga_pcs,
          },
          create: {
            id: data.id,
            nama: data.nama,
            isi: data.isi,
            harga_pack: data.harga_pack,
            harga_pcs: data.harga_pcs,
          },
        });
      }

      if (action === "delete") {
        await prisma.barang.delete({
          where: { id: data.id },
        });
      }
    }

    /* =========================
       STOCK OPNAME
    ========================= */
    /* =========================
       STOCK OPNAME (so_detail)
    ========================= */
    if (table === "so_detail") {
      // Pastikan model so_detail sudah ada di Prisma schema dan sudah migrate ke Neon Tech
      if (action === "upsert") {
        await prisma.so_detail.upsert({
          where: { id: data.id },
          update: {
            lembar: data.lembar,
            barang_id: data.barang_id,
            nama_barang: data.nama_barang,
            qty_awal_pack: data.qty_awal_pack,
            qty_awal_pcs: data.qty_awal_pcs,
            qty_akhir_pack: data.qty_akhir_pack,
            qty_akhir_pcs: data.qty_akhir_pcs,
            total_awal_pcs: data.total_awal_pcs,
            total_akhir_pcs: data.total_akhir_pcs,
            nilai_awal: data.nilai_awal,
            nilai_akhir: data.nilai_akhir,
            selisih_nilai: data.selisih_nilai,
            updatedAt: data.updatedAt,
          },
          create: {
            id: data.id,
            lembar: data.lembar,
            barang_id: data.barang_id,
            nama_barang: data.nama_barang,
            qty_awal_pack: data.qty_awal_pack,
            qty_awal_pcs: data.qty_awal_pcs,
            qty_akhir_pack: data.qty_akhir_pack,
            qty_akhir_pcs: data.qty_akhir_pcs,
            total_awal_pcs: data.total_awal_pcs,
            total_akhir_pcs: data.total_akhir_pcs,
            nilai_awal: data.nilai_awal,
            nilai_akhir: data.nilai_akhir,
            selisih_nilai: data.selisih_nilai,
            updatedAt: data.updatedAt,
          },
        });
      }
      if (action === "delete") {
        await prisma.so_detail.delete({
          where: { id: data.id },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}
