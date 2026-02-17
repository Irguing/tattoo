import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const existing = await prisma.adminUser.findUnique({
    where: { email: "admin@miko.com" },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.create({
    data: {
      email: "admin@miko.com",
      password: hashed,
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
