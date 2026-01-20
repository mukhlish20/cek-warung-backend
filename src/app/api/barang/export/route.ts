import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    // =========================
    // AUTH
    // =========================
    const auth = verifyToken(req);
    if (!auth || auth.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // =========================
    // AMBIL DATA BARANG
    // =========================
    const barang = await prisma.barang.findMany({
      orderBy: { nama: "asc" },
    });

    // =========================
    // BUAT EXCEL
    // =========================
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Data Barang");

    sheet.columns = [
      { header: "Nama Barang", key: "nama", width: 30 },
      { header: "Isi per Pack", key: "isi", width: 15 },
      { header: "Harga Pack", key: "harga_pack", width: 15 },
      { header: "Harga PCS", key: "harga_pcs", width: 15 },
      { header: "Terakhir Update", key: "updatedAt", width: 25 },
    ];

    barang.forEach((b) => {
      sheet.addRow({
        nama: b.nama,
        isi: b.isi,
        harga_pack: b.harga_pack,
        harga_pcs: b.harga_pcs,
        updatedAt: b.updatedAt.toISOString(),
      });
    });

    // Header bold
    sheet.getRow(1).font = { bold: true };

    // =========================
    // RESPONSE FILE
    // =========================
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          `attachment; filename="data-barang.xlsx"`,
      },
    });
  } catch (err) {
    console.error("EXPORT BARANG ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Gagal export data barang" },
      { status: 500 }
    );
  }
}
