import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: ADMIN_EMAIL },
        { username: ADMIN_USERNAME },
      ],
    },
  });

  let adminUser;

  if (existingUser) {
    adminUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: hashedPassword,
        userType: "seller",
        isAdmin: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        userType: true,
        isAdmin: true,
      },
    });
  } else {
    adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: hashedPassword,
        userType: "seller",
        isAdmin: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        userType: true,
        isAdmin: true,
      },
    });
  }

  console.log(JSON.stringify(adminUser, null, 2));
}

main()
  .catch((error) => {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
