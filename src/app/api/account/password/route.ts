import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, newPassword } = body;

    if (!userId || !newPassword) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { message: "Gagal update password" },
      { status: 500 }
    );
  }
}
