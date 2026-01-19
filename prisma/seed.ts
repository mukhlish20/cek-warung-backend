import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@cekwarung.local" },
    update: {},
    create: {
      nama: "Admin Warung",
      email: "admin@cekwarung.local",
      password: hashed,
      role: Role.ADMIN,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
