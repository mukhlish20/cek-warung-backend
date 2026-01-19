import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

export async function POST(req: Request) {
  try {
    const { nama, email, password, role } =
      await req.json();

    if (!nama || !email || !password || !role) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(
      { message: "Gagal menambah user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      password: true,
      role: true,
    },
  });

  return NextResponse.json(users);
}
