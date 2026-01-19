import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID tidak valid" },
        { status: 400 }
      );
    }

    // Cegah hapus admin terakhir (opsional tapi aman)
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    if (user.role === "ADMIN" && adminCount <= 1) {
      return NextResponse.json(
        { message: "Minimal harus ada 1 admin" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { message: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
