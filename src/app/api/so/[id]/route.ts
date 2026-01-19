import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

/* =====================================================
   DELETE /api/so/:id
===================================================== */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    // ⬇️ PENTING: params HARUS di-await
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    // Pastikan data ada
    const existing = await prisma.so_detail.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data SO tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus data
    await prisma.so_detail.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data SO berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/so/:id error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
