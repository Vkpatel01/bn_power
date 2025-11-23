import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@BnpowerE", 12);

  const admin = await prisma.admin.upsert({
    where: { username: "admin@bnpowere" },
    update: {},
    create: {
      username: "admin@bnpowere",
      password: hashedPassword,
    },
  });

  console.log("Admin user created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
