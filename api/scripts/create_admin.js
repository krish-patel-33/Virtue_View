import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("\n=== VirtueView Admin User Setup ===\n");
  
  const ADMIN_USERNAME = await question("Enter admin username (default: admin): ") || "admin";
  const ADMIN_EMAIL = await question("Enter admin email: ");
  const ADMIN_PASSWORD = await question("Enter admin password (min 8 chars): ");

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Email and password are required!");
    process.exit(1);
  }

  if (ADMIN_PASSWORD.length < 8) {
    console.error("Password must be at least 8 characters long!");
    process.exit(1);
  }

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
    console.log("\nUser already exists. Updating to admin...\n");
    adminUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: hashedPassword,
        userType: "seller",
        isAdmin: true,
        accountStatus: "active",
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
    console.log("\nCreating new admin user...\n");
    adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: hashedPassword,
        userType: "seller",
        isAdmin: true,
        accountStatus: "active",
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

  console.log("✅ Admin user created/updated successfully!");
  console.log("\nAdmin details:");
  console.log(JSON.stringify(adminUser, null, 2));
  console.log("\n⚠️  Please store your credentials securely!\n");
  
  rl.close();
}

main()
  .catch((error) => {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
