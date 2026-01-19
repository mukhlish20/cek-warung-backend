import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/users/sync
 * Receive users dari client dan simpan ke server
 */
export async function POST(req: Request) {
  try {
    const users = await req.json();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: "Data user tidak valid" },
        { status: 400 }
      );
    }

    // Upsert users - jika ada yang duplikat email, update data
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          nama: user.nama,
          password: user.password,
          role: user.role,
        },
        create: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          password: user.password,
          role: user.role,
        },
      });
    }

    console.log(`✅ Synced ${users.length} users to server`);

    return NextResponse.json({
      success: true,
      message: `${users.length} user berhasil disync`,
    });
  } catch (error: any) {
    console.error("Sync users error:", error);
    return NextResponse.json(
      { message: "Gagal sync users" },
      { status: 500 }
    );
  }
}
